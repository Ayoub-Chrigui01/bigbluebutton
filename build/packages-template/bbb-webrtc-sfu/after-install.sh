#!/bin/bash -ex

source /etc/lsb-release

case "$1" in
  configure|upgrade|1|2)

    TARGET=/usr/local/bigbluebutton/bbb-webrtc-sfu/config/default.yml

    cp /usr/local/bigbluebutton/bbb-webrtc-sfu/config/default.example.yml $TARGET
    chown bigbluebutton:bigbluebutton $TARGET

      # yq e -i ".kurento[0].ip = \"$IP\"" $TARGET

      # https://github.com/bigbluebutton/bbb-webrtc-sfu/pull/37
      # yq w -i $TARGET kurento[0].url "ws://$SERVER_URL:8888/kurento"

      # Set mediasoup IPs
      yq e -i ".mediasoup.webrtc.listenIps[0].announcedIp = \"$IP\"" $TARGET
      yq e -i ".mediasoup.plainRtp.listenIp.announcedIp = \"$IP\"" $TARGET

      FREESWITCH_IP=$(xmlstarlet sel -t -v '//X-PRE-PROCESS[@cmd="set" and starts-with(@data, "local_ip_v4=")]/@data' /opt/freeswitch/conf/vars.xml | sed 's/local_ip_v4=//g')
      if [ "$FREESWITCH_IP" != "" ]; then
        yq e -i ".freeswitch.ip = \"$FREESWITCH_IP\"" $TARGET
        yq e -i ".freeswitch.sip_ip = \"$IP\"" $TARGET
      else
        # Looks like the FreeSWITCH package is being installed, let's fall back to the default value
        yq e -i ".freeswitch.ip = \"$IP\"" $TARGET
        if [ "$DISTRIB_CODENAME" == "focal" ]; then
          yq e -i ".freeswitch.sip_ip = \"$IP\"" $TARGET
        fi
      fi
 
    cd /usr/local/bigbluebutton/bbb-webrtc-sfu
    mkdir -p node_modules

    # there's a problem rebuilding bufferutil
    # do not abort in case npm rebuild return something different than 0
    #npm config set unsafe-perm true
    #npm rebuild || true

    mkdir -p /var/log/bbb-webrtc-sfu/
    touch /var/log/bbb-webrtc-sfu/bbb-webrtc-sfu.log

    yq e -i '.recordWebcams = true' $TARGET


    echo "Resetting mcs-address from localhost to 127.0.0.1"
    yq e -i '.mcs-address = "127.0.0.1"' $TARGET
    
    if id bigbluebutton > /dev/null 2>&1 ; then
      chown -R bigbluebutton:bigbluebutton /usr/local/bigbluebutton/bbb-webrtc-sfu /var/log/bbb-webrtc-sfu/
    else
      echo "#"
      echo "# Warning: Unable to assign ownership of bigbluebutton to sfu files"
      echo "#"
    fi

    # Creates the mediasoup raw media file dir if needed
    if [ ! -d /var/mediasoup ]; then
      mkdir -p /var/mediasoup
    fi

    # Create a symbolic link from /var/kurento -> /var/lib/kurento if needed
    # if [ ! -d /var/kurento ]; then
    #   if [ -d /var/lib/kurento ]; then
    #     ln -s /var/lib/kurento /var/kurento
    #   fi
    # fi

    chmod 644 $TARGET
    chown bigbluebutton:bigbluebutton $TARGET

    # if [ ! -d /var/log/kurento-media-server ]; then
    #   mkdir -p /var/log/kurento-media-server
    # fi

    # chown kurento:root /var/log/kurento-media-server

    # Ensure a default port range is setup
#     if ! grep -v '^;' /etc/kurento/modules/kurento/BaseRtpEndpoint.conf.ini | grep -q minPort; then
#       cat >> /etc/kurento/modules/kurento/BaseRtpEndpoint.conf.ini << HERE

# # Added by bbb-webrtc-sfu.postinst $(date)
# minPort=24577
# maxPort=32768
# HERE
#     fi

    # Check if using Kurento packages with focal

    reloadService nginx
    startService bbb-webrtc-sfu        || echo "bbb-webrtc-sfu could not be registered or started"
    # startService kurento-media-server  || echo "kurento-media-serve could not be registered or started"

  ;;

  abort-upgrade|abort-remove|abort-deconfigure)

  ;;

  *)
    echo "postinst called with unknown argument \`$1'" >&2
    exit 1
  ;;
esac

