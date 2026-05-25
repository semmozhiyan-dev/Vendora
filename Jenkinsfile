pipeline {
    agent any
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
    triggers {
        githubPush()
    }
    stages {
        stage('Clone Repository') {
            steps {
                checkout scm
            }
        }
        stage('Verify Docker') {
            steps {
                sh '''
                    if docker compose version >/dev/null 2>&1; then
                        echo "Docker Compose v2 found"
                    elif command -v docker-compose >/dev/null 2>&1; then
                        echo "Docker Compose v1 found"
                    else
                        echo "Docker Compose not found"
                        exit 1
                    fi
                '''
            }
        }
        stage('Stop Existing Containers') {
            steps {
                sh '''
                    set -eu
                    if docker compose version >/dev/null 2>&1; then
                        docker compose -f "$COMPOSE_FILE" down --remove-orphans
                    elif command -v docker-compose >/dev/null 2>&1; then
                        docker-compose -f "$COMPOSE_FILE" down --remove-orphans
                    fi
                '''
            }
        }
        stage('Build Containers') {
            steps {
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
                sh './scripts/healthcheck.sh'
            }
        }
        stage('Deployment Success Message') {
            steps {
                echo 'Deployment successful!'
            }
        }
    }
    post {
        always {
            sh '''
                if docker compose version >/dev/null 2>&1; then
                    docker compose -f "$COMPOSE_FILE" ps
                elif command -v docker-compose >/dev/null 2>&1; then
                    docker-compose -f "$COMPOSE_FILE" ps
                fi
            '''
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}
