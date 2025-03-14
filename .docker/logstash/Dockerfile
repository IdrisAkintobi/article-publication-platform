FROM docker.elastic.co/logstash/logstash:8.17.2

# Ensure commands are run as root
USER root

# Install necessary libraries
RUN apt-get update && apt-get install -y netbase

# Switch back to the logstash user
USER logstash

# Install plugins and copy config
RUN logstash-plugin install logstash-input-mongodb logstash-filter-json logstash-output-stdout
COPY logstash.conf /usr/share/logstash/pipeline/