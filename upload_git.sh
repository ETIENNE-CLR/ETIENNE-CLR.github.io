#!/bin/bash

# Fonction pour afficher un message visible et clair dans la console
messageSortie=""
DisplayMessage() {
    message="$1"
    echo -e "\033[1;33m<=-----------------------------=>\033[0m"
    echo -e "\033[1;32m       $message\033[0m"
    echo -e "\033[1;33m<=-----------------------------=>\033[0m"
}

# Tester si l'agent de connection est lançé :
eval "$(ssh-agent -s)"

# Obtention du nom de la clé privée
cleSSH="Cle_github"     # Clé de mon PC portable
cleSSH="id_rsa"         # Clé de mon PC gaming
cleSSH="etienneclr_key" # Clé du PC de l'école

# Ajouter votre clef privée à l'agent
ssh-add ~/.ssh/$cleSSH
ssh-add -l
ssh -T git@github.com

# Nom de la branche
brancheName="main"
git branch --set-upstream-to=origin/$brancheName $brancheName

# Nom du Repositories
urlRepo="git@github.com:ETIENNE-CLR/ETIENNE-CLR.github.io.git"
git remote set-url origin $urlRepo
git config --global credential.helper cache

# Créer le message de commit
git status
messageCommit=""
dateActuelle=$(LC_TIME=fr_FR.UTF-8 date +"%A, %d %B %Y")
if [ -z "$1" ]; then
    read -p "Quel est votre message de commit : " messageCommit
    messageCommit="[$dateActuelle] $messageCommit"
else
    messageCommit="[$dateActuelle] $1"
fi

# Faire le commit
git add .
git commit -m "$messageCommit"
if [ $? -ne 0 ]; then
    messageSortie="Le commit n'a pas marché"
    DisplayMessage "$messageSortie"
fi

# Faire le pull
# git push origin $brancheName
# if [ $? -ne 0 ]; then
#     messageSortie="Le pull n'a pas marché"
#     DisplayMessage "$messageSortie"
# fi

# Faire le push
GIT_SSH_COMMAND="ssh -i ~/.ssh/$cleSSH" git push -u origin $brancheName
# git push origin $brancheName
if [ $? -eq 0 ]; then
    messageSortie="GitHub mis à jour"
    DisplayMessage "$messageSortie"
else
    messageSortie="Le push n'a pas marché"
    DisplayMessage "$messageSortie"
fi
