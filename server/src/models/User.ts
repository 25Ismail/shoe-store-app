import { Schema, model, Document } from 'mongoose'
import bcrypt from 'bcrypt'

export interface IUser extends Document {
  email: string
  passwordHash: string
  comparePassword(candidate: string): Promise<boolean>
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true },
)

// Hash the password before saving. The check prevents double-hashing if we save again later.
userSchema.pre('save', async function () {
  if (!this.isModified('passwordHash')) return
  this.passwordHash = await bcrypt.hash(this.passwordHash, 10)
})

userSchema.methods.comparePassword = function (candidate: string): Promise<boolean> {
  return bcrypt.compare(candidate, this.passwordHash as string)
}

export const User = model<IUser>('User', userSchema)
