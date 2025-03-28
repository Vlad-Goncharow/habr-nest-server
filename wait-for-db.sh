  #!/bin/sh

  # Ожидание доступности PostgreSQL
  until pg_isready -h postgres -U postgres -d HabrServer; do
    echo "Waiting for PostgreSQL to start..."
    sleep 1
  done

  echo "PostgreSQL is ready!"