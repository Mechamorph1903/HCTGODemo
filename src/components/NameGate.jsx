//Modal blocking app access requriing user to input name
import { useAuthContext } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { useDebounce } from "../hooks/debounce";



export default function NameGate({children}){
    const { profile, setName, isUsernameTaken } = useAuthContext()
    const [fName, setFName] = useState('')
    const [lName, setLName] = useState('')
    const [uName, setUName] = useState('')
    const [usernameTouched, setUsernameTouched] = useState(false)
    const [usernameError, setUsernameError] = useState(null)

    const MIN_USERNAME_LENGTH = 5

    const debouncedFName = useDebounce(fName, 400)
    const debouncedLName = useDebounce(lName, 400)

    //SUggesting username form first and lastname, so as to not bother people to think of username
    useEffect(() => {
        if (!debouncedFName.trim() || !debouncedLName.trim() || usernameTouched) return
        

        const suggest = async () => {
            const first = debouncedFName.trim().toLowerCase()
            const last = debouncedLName.trim().toLowerCase()

            let base = (first[0] + last).replace(/\s+/g, '')
            let chars = 1
            while (base.length < MIN_USERNAME_LENGTH && chars < first.length) {
                chars++
                base = (first.slice(0, chars) + last).replace(/\s+/g, '')
            }
            while (base.length < MIN_USERNAME_LENGTH) base += '0'

            let candidate
            let attempts = 0
            do {
                const randomSuffix = Math.floor(Math.random() * 900) + 100   // random 3-digit number, 100–999
                candidate = `${base}${randomSuffix}`
                attempts++
            } while (await isUsernameTaken(candidate) && attempts < MAX_SUGGESTION_ATTEMPTS)

            setUName(candidate)
        }
        suggest()
    }, [debouncedFName, debouncedLName])

    if (profile === null) return null

    if (profile.userName === null){
        return (
            <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center p-6">
                <h1 className="font-bold text-xl mb-8">Welcome to HCTGo</h1>
                <h1 className=" text-lg mb-6">Tell Us Your Name!</h1>
                <form 
                className="grid grid-cols-4 gap-x-2 gap-y-4 w-full"
                onSubmit={ async (e) => {
                    e.preventDefault();
                    setUsernameError(null)
                    if (await isUsernameTaken(uName)) {
                        setUsernameError("That username's taken — try another.")
                        return
                    }
                    setName({firstName: fName, lastName: lName, userName: uName})

                }}>
                    <div className="flex flex-col col-span-2 items-center">
                        <label htmlFor="fname" className="mb-1 text-sm text-slate-500">First Name</label>
                        <input type="text" id="fname" name="first name" value={fName} onChange={(e) => setFName(e.target.value)} className="w-full px-4 py-2 bg-amber-50 text-slate-900 rounded-2xl border border-transparent shadow-inner focus:outline-none focus:border-blue-500/50 transition-all" required/>
                    </div>
                    <div className="flex flex-col col-span-2 items-center" >
                        <label htmlFor="lname" className="mb-1 text-sm text-slate-500">Last Name</label>
                        <input type="text" id="lname" name="last name" value={lName} onChange={(e) => setLName(e.target.value)} className="w-full px-4 py-2 bg-amber-50 text-slate-900 rounded-2xl border border-transparent shadow-inner focus:outline-none focus:border-blue-500/50 transition-all" required/>
                    </div>
                    <div className="col-span-4 items-center flex flex-col">
                        <label htmlFor="uname" className="mb-1 text-sm text-slate-500">Username</label>
                        <input type="text" id="uname" name="username" value={uName} onChange={(e) => {setUName(e.target.value); setUsernameTouched(true)}} className="w-full px-4 py-2 bg-amber-50 text-slate-900 rounded-2xl border border-transparent shadow-inner focus:outline-none focus:border-blue-500/50 transition-all" minLength={5} required/>
                        {
                            usernameError && (<p className="text-red-50">Sorry, this username has already been taken</p>)
                        }
                    </div>
                    <button type="submit" disabled={!fName || !lName || uName.length < 5} className="col-span-4 py-3 rounded-full font-semibold text-white bg-blue-600 disabled:bg-slate-300 disabled:text-slate-500 transition-colors">
                        Done
                    </button>
                </form>
            </div>
        )
    }

    return children
}