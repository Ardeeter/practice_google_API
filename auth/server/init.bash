# sequelize model:generate --name user \
#   --attributes email:string,password:string
# sequelize model:generate --name auth --attributes token:string,refresh_token:string,scope:string,token_type:string
sequelize model:generate --name userFolders --attributes userID:integer,folderID:string,folderName:string