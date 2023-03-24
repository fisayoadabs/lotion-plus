import { useEffect, useRef, useState } from "react";
import { Outlet, useNavigate, Link } from "react-router-dom";
import NoteList from "./NoteList";
import { v4 as uuidv4 } from "uuid";
import { currentDate } from "./utils";

const localStorageKey = "lotion-v1";
function Layout({ logOut, profile, user }) {
  const navigate = useNavigate();
  const mainContainerRef = useRef(null);
  const [collapse, setCollapse] = useState(false);
  const [notes, setNotes] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [currentNote, setCurrentNote] = useState(-1);

  useEffect(() => {
    const height = mainContainerRef.current.offsetHeight;
    mainContainerRef.current.style.maxHeight = `${height}px`;
    const existing = localStorage.getItem(localStorageKey);
    if (existing) {
      try {
        setNotes(JSON.parse(existing));
      } catch {
        setNotes([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(localStorageKey, JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    if (currentNote < 0) {
      return;
    }
    if (!editMode) {
      navigate(`/notes/${currentNote + 1}`);
      return;
    }
    navigate(`/notes/${currentNote + 1}/edit`);
  }, [notes]);

  const saveNote = async (note, index) => {
    note.body = note.body.replaceAll("<p><br></p>", "");
    setNotes([
      ...notes.slice(0, index),
      { ...note },
      ...notes.slice(index + 1),
    ]);
    setCurrentNote(index);
    setEditMode(false);

    var res = await fetch(
      `https://ls3njoflzw6ebgjzpdk4lmgs640dqmjj.lambda-url.ca-central-1.on.aws?email=${profile.email}&id=${note.id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          email: profile.email,
          token: user.access_token,
        },
        body: JSON.stringify({ ...note, email: profile.email }),
      }
    );

    // const jsonRes = await res.json();
    // console.log(jsonRes)
  };

  useEffect(() => {
    const getNoteEffect = async () => {
      if (profile.email) {
        const rev = await fetch(
          `https://rszorazlzvi352fbcodo7geuzq0lwlve.lambda-url.ca-central-1.on.aws?email=${profile.email}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              email: profile.email,
              token: user.access_token,
            },
          }
        );
        const notes = await rev.json();
        setNotes(notes);
      }
    };
    getNoteEffect();
  }, [profile.email]);

  const deleteNote = async (id, index) => {
    const rev = await fetch(
      `https://7upmz5bg24k365nnapxv7ypomi0dqkxj.lambda-url.ca-central-1.on.aws`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          email: profile.email,
          token: user.access_token,
        },
        body: JSON.stringify({ email: profile.email, id: id }),
      }
    );
    if (rev.status === 200) {
      setNotes([...notes.slice(0, index), ...notes.slice(index + 1)]);
      setCurrentNote(0);
      setEditMode(false);
    }
    console.log(rev.status);
  };

  const addNote = () => {
    setNotes([
      {
        id: uuidv4(),
        title: "Untitled",
        body: "",
        when: currentDate(),
      },
      ...notes,
    ]);
    setEditMode(true);
    setCurrentNote(0);
  };

  useEffect(() => {
    localStorage.setItem("username", JSON.stringify(user));
    localStorage.setItem("userProfile", JSON.stringify(profile));
  }, [user]);

  return (
    <div>
      <div id="container">
        <header>
          <aside>
            <button id="menu-button" onClick={() => setCollapse(!collapse)}>
              &#9776;
            </button>
          </aside>
          <div id="app-header">
            <h1>
              <Link to="/notes">Lotion</Link>
            </h1>
            <h6 id="app-moto">Like Notion, but worse.</h6>
          </div>
          <aside>
            <button onClick={logOut}>
              <strong>{profile.name} (Log-out)</strong>
            </button>
          </aside>
        </header>
        <div id="main-container" ref={mainContainerRef}>
          <aside id="sidebar" className={collapse ? "hidden" : null}>
            <header>
              <div id="notes-list-heading">
                <h2>Notes</h2>
                <button id="new-note-button" onClick={addNote}>
                  +
                </button>
              </div>
            </header>
            <div id="notes-holder">
              <NoteList notes={notes} />
            </div>
          </aside>
          <div id="write-box">
            <Outlet context={[notes, saveNote, deleteNote]} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Layout;
