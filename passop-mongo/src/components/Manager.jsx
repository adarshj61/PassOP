import react from 'react'
import { useRef, useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import 'react-toastify/dist/ReactToastify.css';

const Manager = () => {
    const ref = useRef()
    const passwordRef = useRef()
    const [form, setform] = useState({ site: "", username: "", password: "" })
    const [passwordArray, setPasswordArray] = useState([])

    const getPasswords = async () => {
        let req = await fetch("https://pass-op-eta.vercel.app")
        let passwords = await req.json()
        setPasswordArray(passwords)
    }


    useEffect(() => {
        getPasswords()
    }, [])


    const copyText = (text) => {
        toast('Copied to clipboard!', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });
        navigator.clipboard.writeText(text)
    }

    const showPassword = () => {
        passwordRef.current.type = "text"
        console.log(ref.current.src)
        if (ref.current.src.includes("icons/eyecross.png")) {
            ref.current.src = "icons/eye.png"
            passwordRef.current.type = "password"
        }
        else {
            passwordRef.current.type = "text"
            ref.current.src = "icons/eyecross.png"
        }

    }

    const savePassword = async () => {
        if (form.site.length > 3 && form.username.length > 3 && form.password.length > 3) {

            // If any such id exists in the db, delete it 
            await fetch("http://localhost:3000/", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: form.id }) })

            setPasswordArray([...passwordArray, { ...form, id: uuidv4() }])
            await fetch("http://localhost:3000/", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, id: uuidv4() }) })

            // Otherwise clear the form and show toast
            setform({ site: "", username: "", password: "" })
            toast('Password saved!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        }
        else {
            toast('Error: Password not saved!');
        }

    }

    const deletePassword = async (id) => {
        console.log("Deleting password with id ", id)
        let c = confirm("Do you really want to delete this password?")
        if (c) {
            setPasswordArray(passwordArray.filter(item => item.id !== id))
            
            await fetch("http://localhost:3000/", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) })

            toast('Password Deleted!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true, 
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        }

    }

    const editPassword = (id) => {
        setform({ ...passwordArray.filter(i => i.id === id)[0], id: id })
        setPasswordArray(passwordArray.filter(item => item.id !== id))
    }


    const handleChange = (e) => {
        setform({ ...form, [e.target.name]: e.target.value })
    }

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition="Bounce"
      />
      {/* Same as */}
      <ToastContainer />
      <div className="absolute inset-0 -z-10 h-full w-full bg-green-50 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-green-400 opacity-20 blur-[100px]"></div>
      </div>
      <div className=" p-3 md:mycontainer min-h-[88.2vh] ">
        <h1 className="text-4xl text font-bold text-center">
          <span className="text-green-500"> &lt;</span>

          <span>Pass</span>
          <span className="text-green-500">OP/&gt;</span>
        </h1>
        <p className="text-green-900 text-lg text-center">
          Your own Password Manager
        </p>

        <div className="flex flex-col p-4 text-black gap-8 items-center">
          <input
            value={form.site}
            onChange={handleChange}
            placeholder="Enter website URL"
            className=" bg-white rounded-full border border-green-500 w-full p-4 py-1"
            type="text"
            name="site"
            id="site"
          />
          <div className="flex flex-col md:flex-row w-full justify-between gap-8">
            <input
              value={form.username}
              onChange={handleChange}
              placeholder="Enter Username"
              className="bg-white rounded-full border border-green-500 w-full p-4 py-1"
              type="text"
              name="username"
              id="username"
            />
            <div className="relative">
              <input
                ref={passwordRef}
                value={form.password}
                onChange={handleChange}
                placeholder="Enter Password"
                className="bg-white rounded-full border border-green-500 w-full p-4 py-1"
                type="password"
                name="password"
                id="password"
              />
              <span
                className="absolute right-[3px] top-[4px] cursor-pointer"
                onClick={showPassword}
              >
                <img
                  ref={ref}
                  className="p-1"
                  width={26}
                  src="icons/eye.png"
                  alt="eye"
                />
              </span>
            </div>
          </div>
          <button
            onClick={savePassword}
            className="flex justify-center items-center gap-2 bg-green-400 hover:bg-green-300 rounded-full px-8 py-2 w-fit border border-green-900"
          >
            {/* Save Icon (SVG) */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 10.5V6a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0021 18V9.75a2.25 2.25 0 00-.659-1.591l-3-3A2.25 2.25 0 0015.75 4.5H15v6h1.5zM9 13.5h6v6H9v-6z"
              />
            </svg>
            Save
          </button>
        </div>

        <div className="passwords">
          <h2 className="font-bold text-2xl py-4">Your Passwords</h2>
          {passwordArray.length === 0 && <div> No passwords to show</div>}
          {passwordArray.length != 0 && (
            <table className="table-auto w-full rounded-md overflow-hidden mb-10">
              <thead className="bg-green-800 text-white">
                <tr>
                  <th className="py-2">Site</th>
                  <th className="py-2">Username</th>
                  <th className="py-2">Password</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-green-100">
                {passwordArray.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td className="py-2 border border-white text-center">
                        <div className="flex items-center justify-center ">
                          <a href={item.site} target="_blank">
                            {item.site}
                          </a>
                          <div
                            className="relative size-7 cursor-pointer flex items-center justify-center 
                           text-green-400 hover:text-green-700 hover:scale-110 transition-all duration-200"
                            onClick={() => {
                              copyText(item.site);
                            }}
                          >
                            {/* Copy Icon (SVG) */}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-6 h-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 9H6a2 2 0 00-2 2v7a2 2 0 002 2h7a2 2 0 002-2v-3M9 9V6a2 2 0 012-2h7a2 2 0 012 2v7a2 2 0 01-2 2h-3M9 9l6 6"
                              />
                            </svg>

                            {/* Tooltip */}
                            <span className="absolute bottom-8 text-xs bg-black text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"></span>
                          </div>
                        </div>
                      </td>
                      <td className="py-2 border border-white text-center">
                        <div className="flex items-center justify-center ">
                          <span>{item.username}</span>
                          <div
                            className="relative size-7 cursor-pointer flex items-center justify-center 
             text-green-400 hover:text-green-700 hover:scale-110 transition-all duration-200"
                            onClick={() => {
                              copyText(item.username);
                            }}
                          >
                            {/* Copy Icon (SVG) */}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-6 h-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 9H6a2 2 0 00-2 2v7a2 2 0 002 2h7a2 2 0 002-2v-3M9 9V6a2 2 0 012-2h7a2 2 0 012 2v7a2 2 0 01-2 2h-3M9 9l6 6"
                              />
                            </svg>

                            {/* Tooltip */}
                            <span className="absolute bottom-8 text-xs bg-black text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                              Copy
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-2 border border-white text-center">
                        <div className="flex items-center justify-center ">
                          <span>{"*".repeat(item.password.length)}</span>
                          <div
                            className="relative size-7 cursor-pointer flex items-center justify-center 
             text-green-400 hover:text-green-700 hover:scale-110 transition-all duration-200"
                            onClick={() => {
                              copyText(item.password);
                            }}
                          >
                            {/* Copy Icon (SVG) */}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-6 h-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 9H6a2 2 0 00-2 2v7a2 2 0 002 2h7a2 2 0 002-2v-3M9 9V6a2 2 0 012-2h7a2 2 0 012 2v7a2 2 0 01-2 2h-3M9 9l6 6"
                              />
                            </svg>

                            {/* Tooltip */}
                            <span className="absolute bottom-8 text-xs bg-black text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                              Copy
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="justify-center py-2 border border-white text-center">
                        <span
                          className="cursor-pointer mx-1 text-gray-400 hover:text-blue-500 hover:scale-110 transition-all duration-200 inline-flex items-center justify-center"
                          onClick={() => {
                            editPassword(item.id);
                          }}
                        >
                          {/* Edit Icon (SVG) */}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M16.862 4.487l2.651 2.651a1.5 1.5 0 010 2.121l-9.193 9.193-4.243 1.061 1.061-4.243 9.193-9.193a1.5 1.5 0 012.121 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19.5 11.25V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V8.25A2.25 2.25 0 016.75 6h8.25"
                            />
                          </svg>
                        </span>

                        <span
                          className="cursor-pointer mx-1 text-gray-400 hover:text-red-500 hover:scale-110 transition-all duration-200 inline-flex items-center justify-center"
                          onClick={() => {
                            deletePassword(item.id);
                          }}
                        >
                          {/* Delete Icon (SVG) */}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 7h12M9 7V4.5A1.5 1.5 0 0110.5 3h3A1.5 1.5 0 0115 4.5V7m-7.5 0h9l-.866 12.142A2.25 2.25 0 0113.393 21H10.61a2.25 2.25 0 01-2.241-1.858L7.5 7z"
                            />
                          </svg>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

export default Manager;
