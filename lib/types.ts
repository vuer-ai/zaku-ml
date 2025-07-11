// Based on the provided user schema from a service like Clerk
export interface ClerkUser {
  id: string
  username: string | null
  first_name: string
  last_name: string
  image_url: string
  has_image: boolean
  primary_email_address_id: string
  email_addresses: {
    id: string
    email_address: string
    verification: {
      status: "verified" | "unverified"
      strategy: string
    }
  }[]
  last_sign_in_at: number | null
  banned: boolean
  locked: boolean
  created_at: number
  updated_at: number
  profile_image_url: string
}

// A more standard organization schema
export interface Organization {
  id: string
  name: string
  slug: string
  members: number
  plan: "Enterprise" | "Pro" | "Basic"
  status: "Active" | "Inactive"
  createdAt: string
  public_metadata?: {
    [key: string]: any
  }
}
