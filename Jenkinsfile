pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Backend Install') {
            steps {
                dir('back') {
                    sh 'npm ci'
                }
            }
        }

        stage('Prepare Test Environment') {
            steps {
                dir('back') {
                    sh 'mkdir -p ci-test-res'
                }
            }
        }

        stage('Backend Tests') {
            environment {
                NODE_ENV = 'test'
                MUSIC_RES = 'ci-test-res'
            }

            steps {
                dir('back') {
                    sh 'npm test'
                }
            }
        }

        stage('Backend Build') {
            steps {
                dir('back') {
                    sh 'npm run build'
                }
            }
        }
    }
}