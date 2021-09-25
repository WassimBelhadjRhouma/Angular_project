// get the API key
import * as SparkPost from 'sparkpost';
import { winston } from '../config/winston.config';

const sp = new SparkPost(process.env.SPARKPOST_KEY);

export const mailer = {
    welcomeEmail: (email, emailConfirmCode): void => {
        sp.transmissions.send({
            options: {
                sandbox: false
            }, content: {
                from: "support@MuzBnb.com",
                subject: `${process.env.APP_NAME} : Votre nouveau compte`,
                html: `<html><body><p>Bonjour et bienvenue à ${process.env.APP_NAME}!</p>
        <p>Merci beaucoup de nous avoir rejoints.</p>
        <p>Vous pouvez vous connecter à ${process.env.APP_NAME} compte dès maintenant pour commencer.</p>
        <p>Veuillez cliquer sur le lien ci-dessous pour confirmer votre adresse e-mail et activer complètement votre compte.</p>
        <a href="${process.env.APP_LINK}/auth/confirm-email?emailCode=${emailConfirmCode}"> 
        ${process.env.APP_LINK}/auth/confirm-email?emailCode=${emailConfirmCode}</a>
        <p>Votre Email code est le suivant : <br> ${emailConfirmCode }.</p>
        <p>Ce lien de confirmation par courrier électronique expirera dans 24 heures.</p>
        <p>Avez-vous des questions? Envoyez-nous un email! Nous sommes toujours là pour vous aider.</p>
        <p>${process.env.APP_NAME} Équipe</p>
        </body></html>`
            },
            recipients: [
                { address: email }
            ],
        }, (err, res) => {
            if (err) {
                winston.error(err);
            }
        });
    },
    resetPassword: (email, confirmationCode): void => {
        sp.transmissions.send({
            options: {
                sandbox: false
            }, content: {
                from: "support@MuzBnb.com",
                subject: `${process.env.APP_NAME} : Réinitialiser le mot de passe`,
                html: `<html><body><p>Quelqu'un (j'espère que vous) a demandé un nouveau mot de passe pour le ${process.env.APP_NAME} compte pour ${email}!</p>
        <p>vous avez oubliez votre mot de passe?.</p>
        <p>Utilisez le lien ci-dessous pour configurer un nouveau mot de passe pour votre compte.</p>
        <p> veuillez utiliser ce code pour changer votre mot de passe: <span style="color:blue"> ${confirmationCode} </span></p>
        <p>Veuillez cliquer sur le lien ci-dessous pour changer votre mot de passe.</p>
        <a href="${process.env.APP_LINK}/auth/reset-password?confirmationCode=${confirmationCode}"> ${process.env.APP_LINK}/auth/reset-password?confirmationCode=${confirmationCode}</a>
        <p>Ce lien de confirmation par courrier électronique expirera dans 24 heures.</p>
        <p>Aucune modification n'a été apportée à votre compte. Par conséquent, donc si vous ne souhaitez pas modifier votre mot de passe ou si vous avez demandé un nouveau mot de passe par erreur, vous pouvez juste ignorer cet e-mail en toute sécurité.</p>
        <p>${process.env.APP_NAME} Équipe</p>
        </body></html>`
            },
            recipients: [
                { address: email }
            ],
        }, (err, res) => {
            if (err) {
                winston.error(err);
            }
        });
    }
}