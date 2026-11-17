/* Adapter extension contract. No broker connection or command is made by this file.
 * Implement server-side MQTT authentication and topic authorization in your bridge.
 * Load your implementation after mqtt-lab.js, then register it:
 *
 * HVACMQTT.registerAdapter({
 *   async connect({url, devEUI, username, password}) { ... },
 *   async subscribe(topic) { ... },
 *   async publish(topic, message, {qos, retain}) { ... },
 *   async disconnect() { ... },
 *   onMessage(callback) { receive = callback; }
 * });
 *
 * Deliver actual reports to receive(topic, jsonStringOrObject), or:
 * HVACMQTT.receive(topic, jsonStringOrObject);
 * On disconnect: HVACMQTT.onDisconnected();
 * Supported uplinks: UG65 raw envelope {devEUI, fPort, data: BASE64},
 * gateway-decoded properties, or {devEUI, object: decodedProperties}.
 * Verify topic, device identity, firmware and codec before enabling real control.
 */
