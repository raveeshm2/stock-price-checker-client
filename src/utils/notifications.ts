import icon from "../images/logo96.png";

export async function showNotification(body: string) {
    if ('Notification' in window) {
        const result = await Notification.requestPermission();
        console.log('result', result);
        if (result === 'granted') {
            if ('serviceWorker' in navigator) {
                const swRegistration = await navigator.serviceWorker.ready;
                const options = {
                    body,
                    icon,
                    tag: 'notificationsEnabled',
                    vibrate: [250],
                    renotify: true,
                    badge: icon
                }
                swRegistration.showNotification('Success', options);
            } else {
                console.log('SW not present');
            }
        } else {
            console.log('Not granted');
        }
    }
}