<?php
/**
 * Miuna Shoutbox
 * https://github.com/martec
 *
 * Copyright (C) 2015-2015, Martec
 *
 * Miuna Shoutbox is licensed under the GPL Version 3, 29 June 2007 license:
 *  http://www.gnu.org/copyleft/gpl.html
 *
 * @fileoverview Miuna Shoutbox - Websocket Shoutbox for Mybb
 * @author Martec
 * @requires jQuery, Nodejs, Socket.io, Express, MongoDB, mongoose, debug and Mybb
 */
$l['miunashoutbox_plug_desc'] = 'Shoutbox Websocket pour MyBB.';
$l['miunashoutbox_sett_desc'] = 'Configuration relative à Miuna Shoutbox.';
$l['miunashoutbox_onoff_title'] = 'Activer Miuna Shoutbox ?';
$l['miunashoutbox_onoff_desc'] = 'Réglez si vous voulez activer ou désactiver Miuna Shoutbox.';
$l['miunashoutbox_heigh_title'] = 'Hauteur de la shoutbox';
$l['miunashoutbox_heigh_desc'] = 'Réglez la hauteur de la shoutbox (valeur en px).';
$l['miunashoutbox_shoutlimit_title'] = 'Nombre de shouts';
$l['miunashoutbox_shoutlimit_desc'] = 'Réglez ici le nombre de shouts visibles dans la shoutbox.';
$l['miunashoutbox_logshoutlimit_title'] = 'Nombre de shouts enregistrés (archives)';
$l['miunashoutbox_logshoutlimit_desc'] = 'Réglez ici le nombre de shouts enregistrés (archives).';
$l['miunashoutbox_nogrp_title'] = 'Groupes qui n\\\'ont pas la permission';
$l['miunashoutbox_nogrp_desc'] = 'Réglez ici les groupes qui n\\\'ont pas la permission d\\\'utiliser Miuna Shoutbox.';
$l['miunashoutbox_mod_title'] = 'Groupe de modération';
$l['miunashoutbox_mod_desc'] = 'Réglez ici les groupes qui ont les droits de modération.';
$l['miunashoutbox_guest_title'] = 'Lecture seule pour les visiteurs';
$l['miunashoutbox_guest_desc'] = 'Les visiteurs n\\\'ont pas accès à la shoutbox. Mais vous pouvez activer la lecture seule pour les visiteurs.';
$l['miunashoutbox_shout_title'] = 'Titre de Miuna Shoutbox';
$l['miunashoutbox_shout_desc'] = 'Réglez ici le titre de la shoutbox qui sera visible.';
$l['miunashoutbox_server_title'] = 'Lien vers le serveur Miuna Shoutbox';
$l['miunashoutbox_server_desc'] = 'Réglez ici l\\\'adresse de votre serveur Miuna Shoutbox.';
$l['miunashoutbox_socketio_title'] = 'Adresse Socket.io';
$l['miunashoutbox_socketio_desc'] = 'Réglez ici l\\\'adresse à laquelle Miuna Shoutbox va se connecter.<br />Pour les utilisateurs d\\\'OpenShift l\\\'adresse "wss://xxxxxx.rhcloud.com:8443" est recommandée (remplacez xxxxxx par votre compte).';
$l['miunashoutbox_imgur_title'] = 'Imgur';
$l['miunashoutbox_imgur_desc'] = 'Réglez ici l\\\'API d\\\'Imgur.';
$l['miunashoutbox_dataf_title'] = 'Format de la date';
$l['miunashoutbox_dataf_desc'] = 'Réglez ici le format de la date (les options de formatage sont disponibles sur http://momentjs.com/docs/).';
$l['miunashoutbox_antiflood_title'] = 'Système anti-flood';
$l['miunashoutbox_antiflood_desc'] = 'Réglez ici le temps (en secondes) entre deux shouts. Réglez à 0 pour désactiver.';
$l['miunashoutbox_newpost_title'] = 'Shout pour les nouveaux messages';
$l['miunashoutbox_newpost_desc'] = 'Envoyer un shout automatiquement lorsqu\\\'un utilisateur poste un message dans un topic.';
$l['miunashoutbox_newthread_title'] = 'Shout pour les nouveaux topics';
$l['miunashoutbox_newthread_desc'] = 'Envoyer un shout automatiquement lorsqu\\\'un utilisateur crée un nouveau topic.';
$l['miunashoutbox_foldacc_title'] = 'Dossiers ignorés pour les shouts pour les nouveaux messages et topics';
$l['miunashoutbox_foldacc_desc'] = 'Réglez ici les dossiers (leur ID) que Miuna Shoutbox va ignorer quand quelqu\\\'un poste dans le forum.';
$l['miunashoutbox_newptstyle_title'] = 'Style pour les shouts pour les nouveaux messages et topics';
$l['miunashoutbox_newptstyle_desc'] = 'Réglez ici le style des shouts pour les nouveaux messages et topics.';
$l['miunashoutbox_oncolor_title'] = 'Couleur de la bordure des utilisateurs en ligne';
$l['miunashoutbox_oncolor_desc'] = 'Réglez ici la couleur de la bordure des utilisateurs en ligne.';
$l['miunashoutbox_mentstyle_title'] = 'Style de la bordure des mentions';
$l['miunashoutbox_mentstyle_desc'] = 'Réglez ici le style de la bordure quand quelqu\\\'un vous mentionne.';
$l['miunashoutbox_edtcolor_title'] = 'Couleur de fond des shouts édités';
$l['miunashoutbox_edtcolor_desc'] = 'Réglez ici la couleur de fond des shouts édités.';
$l['miunashoutbox_zone_title'] = 'Fuseau horaire';
$l['miunashoutbox_zone_desc'] = 'Réglez votre fuseau horaire ici.';
$l['miunashoutbox_stfont_title'] = 'Polices';
$l['miunashoutbox_stfont_desc'] = 'Choisissez les polices que les utilisateurs pourront utiliser.';
$l['miunashoutbox_sizfont_title'] = 'Tailles de police';
$l['miunashoutbox_sizfont_desc'] = 'Choisissez les tailles de police que les utilisateurs pourront utiliser.';
$l['miunashoutbox_shoutstart_title'] = 'Sens d\\\'affichage des shouts';
$l['miunashoutbox_shoutstart_desc'] = 'Choisissez le sens d\\\'affiche des shouts.';
$l['miunashoutbox_shoutstart_opt'] = 'top=Haut
bottom=Bas';
$l['miunashoutbox_deststyl_title'] = 'Désactiver le choix du style';
$l['miunashoutbox_deststyl_desc'] = 'Réglez si vous souhaitez désactiver le choix du style. Si vous choisissez Oui, Miuna Shoutbox utilisera le même style que les shouts pour les nouveaux topics et messages.';
$l['miunashoutbox_destindx_title'] = 'Cacher Miuna Shoutbox sur la page d\\\'accueil ?';
$l['miunashoutbox_destindx_desc'] = 'Réglez ici si vous souhaitez cacher la shoutbox sur la page d\\\'accueil ou non.';
$l['miunashoutbox_actport_title'] = 'Montrer Miuna Shoutbox sur le portail ?';
$l['miunashoutbox_actport_desc'] = 'Réglez ici si vous souhaitez montrer la shoutbox sur le portail ou non.';
$l['miunashoutbox_newpost_lang'] = 'a posté dans le sujet {1}';
$l['miunashoutbox_newthread_lang'] = 'a posté un nouveau sujet {1}';
$l['miunashoutbox_keep_new_lines_title'] = 'Conserver les retours à la ligne dans les shouts ?';
$l['miunashoutbox_keep_new_lines_desc'] = 'Réglez ici si vous souhaitez conserver ou supprimer les retours à la ligne dans les shouts.';
?>
