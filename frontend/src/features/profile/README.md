# profile feature

View & edit the signed-in user's account (name, preferred currency). Mirror the
`auth` feature shape:

```
api/         useProfile(), useUpdateProfile()
components/  ProfileForm, CurrencySelect
hooks/       —
types/       Profile, UpdateProfilePayload
index.ts     public surface
```
Consumed by `ProfilePage` (a protected route).
