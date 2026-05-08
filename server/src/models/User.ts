import { Schema, model, Document } from 'mongoose'
import bcrypt from 'bcrypt'

// Describes what a user document looks like in the database
export interface IUser extends Document {
  email: string
  passwordHash: string
  // Method to check if a plain-text password matches the stored hash
  comparePassword(candidate: string): Promise<boolean>
}

// The shape of the users collection in MongoDB
const userSchema = new Schema<IUser>(
  {
    // Email must be unique — two users can't share the same address
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    // We never store the plain password, only the bcrypt hash
    passwordHash: { type: String, required: true },
  },
  // timestamps: true adds createdAt and updatedAt fields automatically
  { timestamps: true },
)

// Hash the password before saving. The check prevents double-hashing if we save again later.
userSchema.pre('save', async function () {
  if (!this.isModified('passwordHash')) return
  // 10 = number of salt rounds — higher is more secure but slower
  this.passwordHash = await bcrypt.hash(this.passwordHash, 10)
})

// Checks if the password the user typed matches the stored hash
userSchema.methods.comparePassword = function (candidate: string): Promise<boolean> {
  return bcrypt.compare(candidate, this.passwordHash as string)
}

export const User = model<IUser>('User', userSchema)
