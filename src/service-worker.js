/* eslint-disable no-restricted-globals */

// --- All Imports MUST come first to fix the 'import/first' error ---
import { clientsClaim } from 'workbox-core';
import { ExpirationPlugin } from 'workbox-expiration';
import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate, CacheFirst } from 'workbox-strategies';
import { BackgroundSyncPlugin } from 'workbox-background-sync';

clientsClaim();

// This is the standard Workbox syntax. The build tool MUST inject the list of files here.
precacheAndRoute(self.__WB_MANIFEST);

// Set up App Shell routing for navigation requests
const fileExtensionRegexp = new RegExp('/[^/?]+\\.[^/]+$');
registerRoute(
  ({ request, url }) => request.mode === 'navigate' && !fileExtensionRegexp.test(url.pathname),
  createHandlerBoundToURL('/index.html')
);

// --- 1. STALE-WHILE-REVALIDATE for Dynamic News Data ---
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/articles'),
  new StaleWhileRevalidate({
    cacheName: 'news-data-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 24 * 60 * 60,
      }),
    ],
  })
);

// --- 2. CACHE-FIRST for Static Assets ---
registerRoute(
  ({ request }) => request.destination === 'image' || request.destination === 'font',
  new CacheFirst({
    cacheName: 'static-assets-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60,
      }),
    ],
  })
);

// --- 3. BACKGROUND SYNCHRONIZATION for Offline User Actions ---
const bgSyncPlugin = new BackgroundSyncPlugin('user-actions-queue', {
  maxRetentionTime: 24 * 60,
});

registerRoute(
  ({ request }) => request.method === 'POST' || request.method === 'PUT',
  new StaleWhileRevalidate({ 
    cacheName: 'action-sync-queue',
    plugins: [bgSyncPlugin],
  })
);