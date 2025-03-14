# article-publication-platform

A platform where authenticated users can post articles and comment on article posts. The application leverages multiple modern technologies to provide a robust and scalable publishing experience.

## Overview

- **User Posts & Comments:** Authenticated users can create articles, post comments, and engage with content.
- **Real-Time Synchronization:** Articles and related activities are indexed for fast searching and analysis.
- **Containerized Setup:** The entire stack runs seamlessly using Docker Compose.

## Technologies Used

- **BunJS:**  
  Used as the JavaScript runtime for fast server-side execution, building, and running the application.  
  See [BunJS Documentation](https://bun.sh).

## Docker Compose Architecture

The Docker Compose setup defines several key services:

- **MongoDB:**  
  The primary database for storing articles, comments, and user data. It is in replica set mode for high availability and data redundancy.

- **Monstache:**  
  Runs the Monstache container to sync data from MongoDB to Elasticsearch.

- **Elasticsearch:**  
  Hosts the Elasticsearch cluster which indexes the articles for quick search and retrieval.

- **Kibana:**  
  Provides a visualization layer for the Elasticsearch data, enabling monitoring of article data, search performance, and logs.

- **app:**  
  The main application container built on BunJS. It runs the service that handles users’ requests and business logic.

- **(Additional services):**  
  Other services like Logstash (if configured) can be used to replace Monstache.

    You can setup elasticsearch ssl configuration using the command `bun run setup:elastic:ssl`. The command has to be run while the service is running without ssl configured in the elastic search and kibana yaml files. After running the command, you can configure the ssl in the elastic search and kibana yaml files.

#### -TODO

- Add categories to articles
- Add tests
- Add user roles

### Usage

To install dependencies:

```bash
bun install
```

To run development server:

```bash
bun dev
```

To build the application:

```bash
bun run build
```

To run the application:

```bash
bun start
```

The application should be run with the docker compose command `docker-compose up` to start the services.
