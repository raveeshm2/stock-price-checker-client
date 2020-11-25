import { push } from 'connected-react-router';
import React, { useState } from 'react'
import { Nav, Navbar } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { createToast } from '../ui/toast/action';
import { SettingsModal } from '../user/modals/SettingsModal';
import { LOGOUT_RESOURCE } from '../user/store/saga';
import { showNotification } from '../utils/notifications';
import { SUBSCRIPTION_ADD_RESOURCE } from './subscription/store/saga';

interface NavigationProps { }

export const Navigation: React.FC<NavigationProps> = () => {
    const [settings, setSettings] = useState<boolean>(false);
    const dispatch = useDispatch();

    function urlBase64ToUint8Array(base64String: string) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    async function configurePubSub() {
        if (!('serviceWorker' in navigator)) {
            return;
        }
        const swRegistration = await navigator.serviceWorker.ready;
        const subscription = await swRegistration.pushManager.getSubscription();
        const publicKey = process.env.REACT_APP_VAPID_PUBLIC_KEY;
        const convertedVapidKey = urlBase64ToUint8Array(publicKey!);
        if (!subscription) {
            console.log('No subscription present');
            try {
                const newSubscription = await swRegistration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: convertedVapidKey
                });
                const subscriptionJSON = newSubscription.toJSON();
                dispatch(SUBSCRIPTION_ADD_RESOURCE.request({
                    endpoint: subscriptionJSON.endpoint!,
                    keys: {
                        auth: subscriptionJSON.keys!.auth,
                        p256dh: subscriptionJSON.keys!.p256dh
                    }
                }));
            } catch (err) {
                dispatch(createToast("Error", "You have denied notification alerts. Please enable them from browser settings"));
            }
        } else {
            // Subscription already present on this device, so no need to register again
            showNotification("You are already subscribed to notification services");
            console.log('Subscription already present');
        }
    }

    return (
        <>
            <Navbar bg="dark" variant="dark" fixed="top" expand="md">
                <Navbar.Brand href="#home">Alertify</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ml-auto">
                        <Nav.Link href="#home" onClick={() => dispatch(push('/stockList'))}>Home</Nav.Link>
                        <Nav.Link href="#notifications" onClick={configurePubSub}>Enable Notification Alerts</Nav.Link>
                        <Nav.Link href="#alerts" onClick={() => dispatch(push('/triggerList'))}>Manage Alerts</Nav.Link>
                        <Nav.Link href="#portfolio" onClick={() => dispatch(push('/portfolio'))}>Portfolio</Nav.Link>
                        <Nav.Link href="#settings" onClick={() => setSettings(true)}>Settings</Nav.Link>
                        <Nav.Link href="#logout" onClick={() => dispatch(LOGOUT_RESOURCE.request(null))} >Log out</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
            {settings && <SettingsModal show={settings} onHide={() => { setSettings(false) }} />}
        </>
    );
}