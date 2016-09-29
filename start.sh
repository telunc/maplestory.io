echo 'Starting teleport...'
teleport start --roles=node --nodename=$DOCKERCLOUD_CONTAINER_FQDN --auth-server=$TELEPORT_AUTH_SERVER_IP --token=$TELEPORT_AUTH_TOKEN &
echo 'Starting application...'
npm start