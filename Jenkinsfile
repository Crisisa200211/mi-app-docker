pipeline {
    agent any // Agente configurado [cite: 232]
    
    tools {
        nodejs 'Node18' // Mantenemos tu herramienta nativa configurada en Tools
    }
    
    environment {
        REGISTRY = 'ghcr.io' // Registro GitHub [cite: 235]
        IMAGE_NAME = 'Crisisa200211/mi-app-docker' // Formato usuario/repo [cite: 238]
        
        COMMIT_SHA = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim() // [cite: 240]
        BUILD_TIMESTAMP = sh(script: 'date +%Y%m%d-%H%M%S', returnStdout: true).trim() // [cite: 241]
        
        IMAGE_TAG_LATEST = "${REGISTRY}/${IMAGE_NAME}:latest" // [cite: 243]
        IMAGE_TAG_COMMIT = "${REGISTRY}/${IMAGE_NAME}:${COMMIT_SHA}" // [cite: 244]
        IMAGE_TAG_BUILD  = "${REGISTRY}/${IMAGE_NAME}:build-${BUILD_TIMESTAMP}" // [cite: 245]
    }
    
    stages {
        // STAGE 1: Preparación
        stage('Prepare') {
            steps {
                echo ' Preparando entorno...' // [cite: 253]
                sh 'docker --version' // [cite: 254]
                sh 'node --version' // [cite: 255]
                sh 'npm --version' // [cite: 256]
            }
        }
        
        // STAGE 2: Instalación de Dependencias
        stage('Install Dependencies') {
            steps {
                echo ' 📥  Instalando dependencias...' // [cite: 264]
                sh 'npm install' 
            }
        }
        
        // STAGE 3: Ejecutar Tests
        stage('Test') {
            steps {
                echo ' 🧪  Ejecutando tests...' // [cite: 273]
                sh 'npm test' // [cite: 274]
            }
            post {
                always {
                    junit 'test-results/**/*.xml' // Reportes JUnit exigidos [cite: 279]
                }
            }
        }
        
        // STAGE 4: Construcción de Imagen Docker
        stage('Build Docker Image') {
            steps {
                echo ' 🐳  Construyendo imagen Docker...' // [cite: 288]
                script {
                    docker.build("${IMAGE_TAG_COMMIT}") // Compilación real usando el plugin [cite: 290]
                }
            }
        }
        
        // STAGE 5: Publicación en Registro
        stage('Push to Registry') {
            steps {
                echo ' 📤  Publicando imagen en GitHub Container Registry...' // [cite: 303]
                withCredentials([string(credentialsId: 'github-token', variable: 'GITHUB_TOKEN')]) { // [cite: 382]
                    sh '''
                        echo $GITHUB_TOKEN | docker login ghcr.io -u Crisisa200211 --password-stdin
                    ''' // [cite: 385]
                    sh """
                        docker tag ${IMAGE_TAG_COMMIT} ${IMAGE_TAG_LATEST}
                        docker tag ${IMAGE_TAG_COMMIT} ${IMAGE_TAG_BUILD}
                    """ // [cite: 311, 312]
                    sh """
                        docker push ${IMAGE_TAG_COMMIT}
                        docker push ${IMAGE_TAG_LATEST}
                        docker push ${IMAGE_TAG_BUILD}
                    """ // [cite: 316, 317, 318]
                }
            }
        }
        
        // STAGE 6: Verificación
        stage('Verify Published Image') {
            steps {
                echo ' ✅  Verificando imagen publicada...' // [cite: 331]
                script {
                    sh """
                        echo " 📦  Imagen publicada: ${IMAGE_TAG_COMMIT}"
                        echo " 🏷 ️ Tags disponibles:"
                        echo "  - ${IMAGE_TAG_COMMIT}"
                        echo "  - ${IMAGE_TAG_LATEST}"
                        echo "  - ${IMAGE_TAG_BUILD}"
                    """ // [cite: 334, 336, 337, 338]
                }
            }
        }
    }
    
    post {
        success {
            echo ' 🎉  Pipeline completado exitosamente!' // [cite: 349]
            echo "Notificación simulada enviada con éxito a: crispis111102@gmail.com"
        }
        failure {
            echo ' ❌  Pipeline falló!' // [cite: 357]
            echo "Alerta de fallo simulada enviada a: crispis111102@gmail.com"
        }
        cleanup {
            echo ' 🧹  Limpiando recursos...' // [cite: 365]
            script {
                sh "docker image prune -f" // Mantenimiento del almacenamiento [cite: 369]
            }
        }
    }
}