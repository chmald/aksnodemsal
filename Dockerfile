FROM node:lts-alpine

# Adding SSH support for App Services
RUN apk add --update openssh-server tzdata openrc openssl \
        && echo "root:Docker!" | chpasswd \
        && rm -rf /var/cache/apk/* \
        # Remove unnecessary services
        && rm -f /etc/init.d/hwdrivers \
                 /etc/init.d/hwclock \
                 /etc/init.d/mtab \
                 /etc/init.d/bootmisc \
                 /etc/init.d/modules \
                 /etc/init.d/modules-load \
                 /etc/init.d/modloop \
        # Can't do cgroups
        && sed -i 's/\tcgroup_add_service/\t#cgroup_add_service/g' /lib/rc/sh/openrc-run.sh \
        && apk add --no-cache bash; 

ADD init_container.sh /bin/init_container.sh
ADD sshd_config /etc/ssh/
RUN chmod 755 /bin/init_container.sh

# App Specific Commands
WORKDIR /usr/src/app
COPY app/package*.json ./
RUN npm install
COPY app/. .

ENV SSH_PORT 2222
ENV PORT 8080

EXPOSE 8080 2222
ENTRYPOINT ["/bin/init_container.sh"]