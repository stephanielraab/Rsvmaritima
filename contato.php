<?php
/*
  RSV CONSULTORIA - PROCESSAMENTO DO FORMULÁRIO
  Envia a mensagem para ricardovieira@rsvmaritima.com.br.
  O remetente é o próprio e-mail da RSV; o Reply-To aponta para o cliente.
*/

header('Content-Type: application/json; charset=UTF-8');

define('DESTINO', 'ricardovieira@rsvmaritima.com.br');
define('REMETENTE', 'ricardovieira@rsvmaritima.com.br');
define('NOME_REMETENTE', 'Site RSV');

function responder($ok, $mensagem, $codigo = 200) {
    http_response_code($codigo);
    echo json_encode(['ok' => $ok, 'mensagem' => $mensagem], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    responder(false, 'Método não permitido.', 405);
}

// Campo oculto anti-spam: robôs costumam preencher todos os campos.
if (!empty($_POST['website'] ?? '')) {
    responder(true, 'Mensagem enviada com sucesso. Obrigado pelo contato!');
}

// Remove quebras de linha de campos de cabeçalho (evita injeção de cabeçalhos).
function linha($valor, $limite = 200) {
    $valor = str_replace(["\r", "\n", "\0"], ' ', trim((string) $valor));
    return mb_substr($valor, 0, $limite, 'UTF-8');
}

$nome     = linha($_POST['nome'] ?? '', 120);
$email    = linha($_POST['email'] ?? '', 150);
$telefone = linha($_POST['telefone'] ?? '', 40);
$assunto  = linha($_POST['assunto'] ?? '', 120);
$mensagem = trim(str_replace("\0", '', (string) ($_POST['mensagem'] ?? '')));
$mensagem = mb_substr($mensagem, 0, 5000, 'UTF-8');

if ($nome === '' || $mensagem === '') {
    responder(false, 'Preencha nome e mensagem.', 422);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    responder(false, 'Informe um e-mail válido.', 422);
}

$assuntoEmail = 'Contato pelo site: ' . ($assunto !== '' ? $assunto : 'Sem assunto');
$assuntoCodificado = mb_encode_mimeheader($assuntoEmail, 'UTF-8', 'B', "\r\n");

$corpo  = "Nova mensagem enviada pelo site RSV\n";
$corpo .= "--------------------------------------\n";
$corpo .= "Nome: $nome\n";
$corpo .= "E-mail: $email\n";
$corpo .= "Telefone: " . ($telefone !== '' ? $telefone : 'não informado') . "\n";
$corpo .= "Assunto: " . ($assunto !== '' ? $assunto : 'não informado') . "\n\n";
$corpo .= "Mensagem:\n$mensagem\n";

$cabecalhos = [
    'From: ' . NOME_REMETENTE . ' <' . REMETENTE . '>',
    'Reply-To: ' . $email,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    'X-Mailer: PHP/' . phpversion()
];

$enviado = mail(DESTINO, $assuntoCodificado, $corpo, implode("\r\n", $cabecalhos));

if (!$enviado) {
    responder(false, 'Não foi possível enviar agora. Tente pelo WhatsApp ou pelo e-mail ricardovieira@rsvmaritima.com.br.', 500);
}

responder(true, 'Mensagem enviada com sucesso. Obrigado pelo contato!');
