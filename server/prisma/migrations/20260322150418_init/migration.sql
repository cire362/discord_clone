-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "login" VARCHAR(255) NOT NULL,
    "nickname" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "status" VARCHAR(100) NOT NULL,
    "user_category_id" INTEGER NOT NULL,
    "avatar_url" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User_Categories" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "User_Categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Server" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "server_avatar_url" TEXT,

    CONSTRAINT "Server_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User_server_roles" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "User_server_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User_servers" (
    "id" SERIAL NOT NULL,
    "user_Id" INTEGER NOT NULL,
    "server_Id" INTEGER NOT NULL,
    "user_server_role" INTEGER NOT NULL,

    CONSTRAINT "User_servers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Channel" (
    "id" SERIAL NOT NULL,
    "server_id" INTEGER NOT NULL,
    "channel_name" VARCHAR(255) NOT NULL,

    CONSTRAINT "Channel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "text" VARCHAR(255) NOT NULL,
    "timestamp" TIMESTAMP NOT NULL,
    "sender_id" INTEGER NOT NULL,
    "reciever_id" INTEGER,
    "channel_id" INTEGER,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_login_key" ON "User"("login");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_user_category_id_fkey" FOREIGN KEY ("user_category_id") REFERENCES "User_Categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_servers" ADD CONSTRAINT "User_servers_user_Id_fkey" FOREIGN KEY ("user_Id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_servers" ADD CONSTRAINT "User_servers_server_Id_fkey" FOREIGN KEY ("server_Id") REFERENCES "Server"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_servers" ADD CONSTRAINT "User_servers_user_server_role_fkey" FOREIGN KEY ("user_server_role") REFERENCES "User_server_roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Channel" ADD CONSTRAINT "Channel_server_id_fkey" FOREIGN KEY ("server_id") REFERENCES "Server"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_reciever_id_fkey" FOREIGN KEY ("reciever_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "Channel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
