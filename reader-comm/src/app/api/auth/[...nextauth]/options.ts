import { NextAuthOptions } from "next-auth";
import  CredentialsProvider  from "next-auth/providers/credentials";
import bcrypt from "bcrypt"
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

//auth configuration

export const authOptions : NextAuthOptions = {
    providers :[
        CredentialsProvider({
            id: "credentials",
            name : "credentials",


            credentials: {
                email: { label: "Email", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" },
            },

            async authorize(credentials:any) : Promise<any>{
                await dbConnect();
                console.log("db connected in options and going further");

                try{

                    const user = await UserModel.findOne({
                        $or  : [
                            {email : credentials.identifier},
                            {username : credentials.identifier}
                        ]
                    })

                    if (!user) {
                        throw new Error("Not found with this email");
                      }
            
                      //Make sure he is verified
                     
            
                      //Password verification
                      const correctpass = await bcrypt.compare(
                        credentials.password,
                        user.password
                      );
            
                      if (correctpass) {
                        return user;
                      } else {
                        throw new Error("Incorrect password ");
                      }


                }catch (error: any) {
                    throw new Error(error);
                  }
            }
            
        })
    ]
}