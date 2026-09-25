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

        stage('Backend Tests') {
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