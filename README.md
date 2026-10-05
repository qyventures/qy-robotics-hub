# QY Robotics Hub

Hospitality robotics orchestration platform for robot fleet management, workflow automation, lift, PBX, door and hotel-system integrations.

## Pilot V1

Initial deployment target: W Singapore.

Initial robot family: Keenon.

Initial workflows:
- in-room delivery
- concierge guidance / service request

## V1 platform responsibilities

- hotel, robot and waypoint registry
- workflow engine and task state machine
- Keenon adapter contract
- lift adapter contract for OTIS low-level integration
- PBX/guest-notification interface
- WhatsApp/staff-notification interface
- fleet dashboard data model
- task history and audit log

## Security rule

No supplier, hotel, lift, PBX or messaging credentials may be committed to this repository. Use environment variables or a secrets manager only.

## Integration status

The software can be built independently of vendor access. Live dispatch and lift/PBX control remain gated on Keenon API credentials/docs and OTIS/PBX technical details.
