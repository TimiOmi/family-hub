-- CreateTable
CREATE TABLE "NeedItem" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "tags" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "addedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NeedItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "NeedItem" ADD CONSTRAINT "NeedItem_addedById_fkey" FOREIGN KEY ("addedById") REFERENCES "Person"("id") ON DELETE SET NULL ON UPDATE CASCADE;
