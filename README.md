# HVAC Project Launch Kit

Interactive HVAC product selection, introduction, installation, integration, deployment and optimization guides for WT201 and UC701.

## Website
GitHub Pages publishes this repository automatically after changes are pushed to `main`.

## Local preview
Run `python -m http.server 8765` in this directory, then open http://localhost:8765.

## Device connections
The site defaults to browser simulation. GitHub Pages hosts static files only: it does not provide the MQTT/WebSocket bridge, HTTP receiver, BACnet gateway or Node-RED proxy used by live-device features. Those features require a separately hosted, reachable backend with HTTPS/WSS and appropriate access controls. Private-network addresses are accessible only from the relevant network.

No credentials are bundled. Device credentials entered by visitors are not published to GitHub.

Official documentation, images and codec references remain attributed to their respective sources. See the license files included with third-party assets.
