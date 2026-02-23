self.addEventListener('push', function (event) {
    if (event.data) {
        const data = event.data.json();
        const options = {
            body: data.body,
            icon: '/icon512_rounded.png', // Modifique se desejar outro ícone
            badge: '/icon512_maskable.png', // Transparente para o OS (Android status bar)
            vibrate: [100, 50, 100],
            data: { url: data.url || '/' } // Guardando o hyperlink para quando clicarem
        };

        event.waitUntil(
            self.registration.showNotification(data.title, options)
        );
    }
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close();
    if (event.notification.data.url) {
        event.waitUntil(
            clients.openWindow(event.notification.data.url)
        );
    }
});
