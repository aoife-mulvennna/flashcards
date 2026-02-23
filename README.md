Start DB: docker compose -f docker/docker-compose.yml up -d
Start backend: cd backend && ./mvnw spring-boot:run
Start frontend: cd frontend && ng serve