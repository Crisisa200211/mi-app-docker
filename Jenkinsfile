pipeline {
    agent any // [cite: 232]
    
    environment {
        REGISTRY = 'ghcr.io' // [cite: 235]
        IMAGE_NAME = 'Crisisa200211/mi-app-docker' // [cite: 238]
        
        COMMIT_SHA = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim() // [cite: 240]
        BUILD_TIMESTAMP = sh(script: 'date +%Y%m%d-%H%M%S', returnStdout: true).trim() // [cite: 241]
        
        IMAGE_TAG_LATEST = "${REGISTRY}/${IMAGE_NAME}:latest" // [cite: 243]
        IMAGE_TAG_COMMIT = "${REGISTRY}/${IMAGE_NAME}:${COMMIT_SHA}" // [cite: 244]
        IMAGE_TAG_BUILD  = "${REGISTRY}/${IMAGE_NAME}:build-${BUILD_TIMESTAMP}" // [cite: 245]
    }
    
    stages {
        // STAGE 1: Preparación
        stage('Prepare') { // [cite: 251]
            steps {
                echo ' Preparando entorno...' // [cite: 253]
                sh 'docker --version' // [cite: 254]
                sh 'node --version' // [cite: 255]
                sh 'npm --version' // [cite: 256]
            }
        }
        
        // STAGE 2: Instalación de Dependencias
        stage('Install Dependencies') { // [cite: 262]
            steps {
                echo ' 📥  Instalando dependencias...' // [cite: 264]
                sh 'npm ci' // [cite: 265]
            }
        }
        
        // STAGE 3: Ejecutar Tests
        stage('Test') { // [cite: 271]
            steps {
                echo ' 🧪  Ejecutando tests...' // [cite: 273]
                sh 'npm test' // [cite: 274]
            }
            post {
                always {
                    junit 'test-results/**/*.xml' // [cite: 279]
                }
            }
        }
        
        // STAGE 4: Construcción de Imagen Docker
        stage('Build Docker Image') { // [cite: 286]
            steps {
                echo ' 🐳  Construyendo imagen Docker...' // [cite: 288]
                script {
                    docker.build("${IMAGE_TAG_COMMIT}") // [cite: 290]
                }
            }
        }
        
        // STAGE 5: Publicación en Registro
        stage('Push to Registry') { // [cite: 297]
            when {
                branch 'main' // [cite: 300]
            }
            steps {
                echo ' 📤  Publicando imagen en GitHub Container Registry...' // [cite: 303]
                withCredentials([string(credentialsId: 'github-token', variable: 'GITHUB_TOKEN')]) { // [cite: 381, 382]
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
        
        // STAGE 6: Verificación (Estructura Corregida Aquí)
        stage('Verify Published Image') { // 
            when {
                branch 'main' // [cite: 328]
            }
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
            emailext (
                subject: " ✅  Pipeline Success: \${JOB_NAME} - \${BUILD_NUMBER}", // [cite: 351]
                body: "El pipeline se ha completado exitosamente.\n\nImagen publicada: ${IMAGE_TAG_COMMIT}", // [cite: 352]
                to: 'cristian.olguin@ejemplo.com' // Cambia por tu correo real [cite: 353]
            )
        }
        failure {
            echo ' ❌  Pipeline falló!' // [cite: 357]
            emailext (
                subject: " ❌  Pipeline Failed: \${JOB_NAME} - \${BUILD_NUMBER}", // [cite: 359]
                body: "El pipeline ha fallado. Revisa los logs para más detalles.", // [cite: 360]
                to: 'cristian.olguin@ejemplo.com' // [cite: 361]
            )
        }
        cleanup {
            echo ' 🧹  Limpiando recursos...' // [cite: 365]
            script {
                sh "docker image prune -f" // [cite: 369]
            }
        }
    }
}