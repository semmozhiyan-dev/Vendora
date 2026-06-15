pipeline {
  agent any

  triggers {
    githubPush()
  }

  options {
    timestamps()
    disableConcurrentBuilds()
    buildDiscarder(logRotator(numToKeepStr: '20'))
    timeout(time: 30, unit: 'MINUTES')
  }

  environment {
    COMPOSE_FILE = 'docker-compose.yml'
    HEALTHCHECK_URL = 'http://127.0.0.1/health'
    HEALTHCHECK_MAX_ATTEMPTS = '30'
    HEALTHCHECK_SLEEP_SECONDS = '5'
  }

  stages {
    stage('Clone Repository') {
      steps {
        echo '===== Clone Repository ====='
        checkout scm
        echo 'Repository checkout completed.'
      }
    }

    stage('Verify Docker') {
      steps {
        echo '===== Verify Docker ====='
        sh '''
          set -eu

          if ! command -v docker >/dev/null 2>&1; then
            echo "Docker is not installed or not on PATH."
            exit 1
          fi

          if docker compose version >/dev/null 2>&1; then
            echo "Docker Compose v2 detected."
          elif command -v docker-compose >/dev/null 2>&1; then
            echo "Legacy docker-compose detected."
          else
            echo "Docker Compose is not installed."
            exit 1
          fi

          docker --version
        '''
      }
    }
     stage('Create .env File') {   // <-- Add this here
        steps {
            sh '''
                cat > .env << EOF
GRAFANA_ADMIN_PASSWORD=vendora
GRAFANA_ADMIN_USER=admin
JWT_SECRET=supersecret
DB_URL=mongodb+srv://semmozhi12122005_db_user:Vendora@vendora.ab3r9fe.mongodb.net/?appName=vendora
RAZORPAY_KEY_ID=rzp_test_Sky8bt8lVEhY2R
RAZORPAY_KEY_SECRET=GscZNf5FVu72HBlflZOnIyeS
EOF
            '''
        }
    }

    stage('Stop Existing Containers') {
      steps {
        echo '===== Stop Existing Containers ====='
        sh '''
  set -eu
  if docker compose version >/dev/null 2>&1; then
    docker compose -f "$COMPOSE_FILE" down --remove-orphans || \
    sudo docker compose -f "$COMPOSE_FILE" down --remove-orphans
  elif command -v docker-compose >/dev/null 2>&1; then
    docker-compose -f "$COMPOSE_FILE" down --remove-orphans || \
    sudo docker-compose -f "$COMPOSE_FILE" down --remove-orphans
  fi
'''
      }
    }

    stage('Build Containers') {
      steps {
        echo '===== Build Containers ====='
        sh '''
          set -eu

          if docker compose version >/dev/null 2>&1; then
            docker compose -f "$COMPOSE_FILE" build
          elif command -v docker-compose >/dev/null 2>&1; then
            docker-compose -f "$COMPOSE_FILE" build
          fi
        '''
      }
    }

    stage('Start Containers') {
      steps {
        echo '===== Start Containers ====='
        sh '''
          set -eu

          if docker compose version >/dev/null 2>&1; then
            docker compose -f "$COMPOSE_FILE" up -d --remove-orphans
          elif command -v docker-compose >/dev/null 2>&1; then
            docker-compose -f "$COMPOSE_FILE" up -d --remove-orphans
          fi
        '''
      }
    }

    stage('Health Check') {
      steps {
        echo '===== Health Check ====='
        sh '''
          set -eu

          if ! command -v curl >/dev/null 2>&1; then
            echo "curl is not installed or not on PATH."
            exit 1
          fi

          attempt=1
          while [ "$attempt" -le "$HEALTHCHECK_MAX_ATTEMPTS" ]; do
            echo "Health check attempt ${attempt}/${HEALTHCHECK_MAX_ATTEMPTS}: ${HEALTHCHECK_URL}"

            if curl --fail --silent --show-error "$HEALTHCHECK_URL" >/dev/null; then
              echo "Health check passed."
              exit 0
            fi

            if [ "$attempt" -lt "$HEALTHCHECK_MAX_ATTEMPTS" ]; then
              echo "Health check failed; retrying in ${HEALTHCHECK_SLEEP_SECONDS} seconds..."
              sleep "$HEALTHCHECK_SLEEP_SECONDS"
            fi

            attempt=$((attempt + 1))
          done

          echo "Health check failed after ${HEALTHCHECK_MAX_ATTEMPTS} attempts."
          exit 1
        '''
      }
    }

    stage('Deployment Success Message') {
      steps {
        echo '===== Deployment Success Message ====='
        echo 'Deployment completed successfully and all health checks passed.'
      }
    }
  }

  post {
    always {
      echo '===== Post Deployment Diagnostics ====='
      sh '''
        if docker compose version >/dev/null 2>&1; then
          docker compose -f "$COMPOSE_FILE" ps || true
        elif command -v docker-compose >/dev/null 2>&1; then
          docker-compose -f "$COMPOSE_FILE" ps || true
        fi
      '''
    }

    success {
      echo 'Pipeline completed successfully.'
    }

    failure {
      echo 'Pipeline failed. Review the stage output and container status above.'
    }
  }
}
