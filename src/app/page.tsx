import { Button } from '@/components/ui/button'
import prisma from '@/lib/db';
import React from 'react'

const page = async() => {

  const users = await prisma.user.findMany();

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-300'>
      {users.map((user) => <Button variant={"outline"}>
        {user.name}
      </Button>)}
    </div>
  )
}

export default page
