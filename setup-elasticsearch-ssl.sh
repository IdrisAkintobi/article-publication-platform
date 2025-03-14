#!/bin/bash
set -e

export $(grep -v '^#' .env | xargs)

# Set environment variables
ELASTIC_CONTAINER="elasticsearch"
CERTS_DIR="/usr/share/elasticsearch/config/certs"
ELASTIC_PASSWORD="${ELASTIC_PASSWORD}"
ELASTIC_URI="${ELASTIC_URI}"
SSL_CERT_PASS="${SSL_CERT_PASS}"

echo "⚙️ Setting up Elasticsearch security... ⚙️"

docker exec -it --user root "$ELASTIC_CONTAINER" bash -c "
  echo '###### 📂 ==> Creating Certificates Directory <== 📂 ######';
  mkdir -p $CERTS_DIR;
  chown -R elasticsearch:elasticsearch /usr/share/elasticsearch/config/certs;
  chmod -R 750 /usr/share/elasticsearch/config/certs;
  ls -lah /usr/share/elasticsearch/config/certs;

  echo '###### 🔐 ==> Generating Certificate Authority (CA) 🔐 <== ######';
  cd /usr/share/elasticsearch;
  bin/elasticsearch-certutil ca --pass $SSL_CERT_PASS --pem --out $CERTS_DIR/elastic-stack-ca.zip || true;

  echo '###### 🧾 ==> Extracting CA Files <== 🧾 ######';
  cd $CERTS_DIR;
  unzip -j -o elastic-stack-ca.zip;

  echo '###### 🔏 ==> Generating SSL Certificates <== 🔏 ######';
  cd /usr/share/elasticsearch;
  bin/elasticsearch-certutil cert --ca-cert $CERTS_DIR/ca.crt --ca-key $CERTS_DIR/ca.key --ca-pass $SSL_CERT_PASS --in /usr/share/elasticsearch/instances.yml --pem --out $CERTS_DIR/certs.zip;

  echo '###### 🧾 ==> Extracting SSL Certificates <== 🧾 ######';
  cd $CERTS_DIR;
  unzip -j -o certs.zip;

  sleep 15;
  echo '###### 🔑 Resetting Passwords for elastic and kibana_system  🔑 ######';
  echo -e \"y\n$ELASTIC_PASSWORD\n$ELASTIC_PASSWORD\" | /usr/share/elasticsearch/bin/elasticsearch-reset-password --url \"$ELASTIC_URI\" --username elastic -i;
  echo -e \"y\n$ELASTIC_PASSWORD\n$ELASTIC_PASSWORD\" | /usr/share/elasticsearch/bin/elasticsearch-reset-password --url \"$ELASTIC_URI\" --username kibana_system -i;

  echo '✅ All processes completed successfully!';
"

echo "🚀 Elasticsearch security setup completed!"
echo "♻️ Go ahead and activate the ssl setting in the services, the rebuild 🔄"