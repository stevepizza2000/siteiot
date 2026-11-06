// Reduz a imagem para caber em tamanhoMaximo x tamanhoMaximo e devolve
// apenas o Base64 (sem o prefixo "data:image/jpeg;base64,").
export function redimensionarImagem(arquivo, tamanhoMaximo = 400, qualidade = 0.8) {
    return new Promise((resolve, reject) => {
        const urlTemporaria = URL.createObjectURL(arquivo);
        const img = new Image();

        img.onload = () => {
            URL.revokeObjectURL(urlTemporaria);

            // Math.min(1, ...) garante que nunca ampliamos uma imagem pequena
            const escala = Math.min(1, tamanhoMaximo / Math.max(img.width, img.height));

            const canvas = document.createElement("canvas");
            canvas.width = Math.round(img.width * escala);
            canvas.height = Math.round(img.height * escala);

            const ctx = canvas.getContext("2d");
            // JPEG não tem transparência: sem isso, PNG transparente ficaria com fundo preto
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            const dataUrl = canvas.toDataURL("image/jpeg", qualidade);
            resolve(dataUrl.split(",")[1]);
        };

        img.onerror = () => {
            URL.revokeObjectURL(urlTemporaria);
            reject(new Error("Imagem inválida"));
        };

        img.src = urlTemporaria;
    });
}

