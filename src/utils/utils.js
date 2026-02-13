//validar a senha
function validacaoSenha(senha) {
    const erros = [];
    
    if (senha.length < 8) {
        erros.push(`A senha precisa conter mais de 8 caracteres.`);
        return;
    }

    const possuiMaiuscula = /[A-Z]/.test(senha);
    if (!possuiMaiuscula) {
        erros.push(`A senha precisa conter pelo menos uma letra maiúscula.`);
        return;
    }

    const possuiMinuscula = /[a-z]/.test(senha);
    if (!possuiMinuscula) {
        erros.push(`A senha precisa conter pelo menos uma letra minúscula.`);
        return;
    }

    const possuiNumero = /[0-9]/.test(senha);
    if (!possuiNumero) {
        erros.push(`A senha precisa conter pelo menos um número.`);
        return;
    }

    const especiais = ['!', '@', '#', '*', '%', '$'];
    if (!especiais.some(char => senha.includes(char))) {
        erros.push('A senha precisa conter pelo menos um caractere especial.');
        return;
    }

    if (erros.length > 0) {
        // console.log(erros.join('\n'));
        return { valida: false, erros };
    }
    
    // console.log(`Senha válida!`);
    return { valida: true, erros: [] };
}

// Testando validação de senha
// console.log(validacaoSenha('Exemplo@'));
// console.log(validacaoSenha('Exemplo123'));
// console.log(validacaoSenha('exemplo@123'));
// console.log(validacaoSenha('EXEMPLO@123'));
// console.log(validacaoSenha('Exemplo@123'));


//validar email
export function validacaoEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const valido = regex.test(email);
    
    if (!valido) {
        console.log(`O email "${email}" é inválido.`);
        return { valido: false, email };
    } else {
        console.log(`O email "${email}" é válido.`);
        return { valido: true, email };
    }
}

// Testando validação de email
// console.log(validacaoEmail('exemplo@dominio.com'));
// console.log(validacaoEmail('exemplo@dominio'));
// console.log(validacaoEmail('exemplo.com'));
// console.log(validacaoEmail('@dominio.com'));
// console.log(validacaoEmail('exemplo@.com'));


//classificar semana
export const diasDaSemana = {
    Domingo: 0,
    Segunda: 1,
    Terca: 2,
    Quarta: 3,
    Quinta: 4,
    Sexta: 5,
    Sabado: 6
};

// Função para obter o número do dia
export function obterNumeroDia(nomeDia) {
    const numero = diasDaSemana[nomeDia];
    if (numero !== undefined) {
        return { sucesso: true, numero };
    }
    return { sucesso: false, erro: 'Dia da semana inválido' };
}

// console.log(obterNumeroDia('Sexta'));


//data biblioteca  INSTALA: npm install date-fns
import { parse, format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function formatarData(dataString) {
    try {
        const data = parse(dataString, 'dd/MM/yyyy', new Date())
        
        if (isNaN(data.getTime())) {
            return { 
                sucesso: false, 
                erro: 'Data inválida',
                dataOriginal: dataString 
            };
        }
        
        const dataFormatada = format(data, 'dd MMMM yyyy', { locale: ptBR })
        return { 
            sucesso: true, 
            dataFormatada,
            dataOriginal: dataString 
        };
    } catch (error) {
        return { 
            sucesso: false, 
            erro: error.message,
            dataOriginal: dataString 
        };
    }
}

// console.log(formatarData('29/08/2025'));


// horario biblioteca    INSTALA: npm install dayjs
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat.js'

dayjs.extend(customParseFormat)

export function formatarHora(horaString) {
    try {
        const hora = dayjs(horaString, 'HH:mm', true); // strict parsing
        
        if (!hora.isValid()) {
            return {
                sucesso: false,
                erro: 'Horário inválido',
                horaOriginal: horaString
            };
        }
        
        const horaFormatada = hora.format('HH:mm');
        return {
            sucesso: true,
            horaFormatada,
            horaOriginal: horaString
        };
    } catch (error) {
        return {
            sucesso: false,
            erro: error.message,
            horaOriginal: horaString
        };
    }
}

// console.log(formatarHora('14:30'));


// Função para validar múltiplos emails de uma vez
export function validarEmails(emails) {
    return emails.map(email => validacaoEmail(email));
}
