import { useState, useRef, } from "react";

export default function Newproject() {
  const [showform, setshowform] = useState(false);    // form show / hide karva mate
  const [projects, setProjects] = useState([]);  // badha projects store karva mate //[]empty darray means current ama data nathi 
  const [error, seterror] = useState(false);  //error manage kare 

  // form input ne direct access karva mate 
  const title = useRef();
  const Description = useRef();
  const duedate = useRef();

  function handleDelete(deleteId) {
    setProjects((Projects) =>
      Projects.filter(project => project.id !== deleteId)   //project ni id pass karavi ane ae pass karaveli id ae delete id sathe match kare jo match thai to tene remove kari dese ane navo array return karse 
    );
  }

  // save button click kare tyare input pase thi value ley
  function handlesave() {
    const enteredtitle = title.current.value;  
    const entereddescription = Description.current.value;
    const enteredduedate = duedate.current.value;

    if(!enteredtitle || !entereddescription || !enteredduedate){   // check kare koi bi condition missing hase to aetle agar kai execute ni kare 
      seterror(true);
      return;
    }
    
    // navo projects object banave ane ae projects ne array ma add kare 
    setProjects([
      ...projects,   //juna data ne safe rakhe aene delete ni thava dey               
      {
        id: Date.now(),   //badha element ne navi key ganerate kari aape                    
        title: enteredtitle,
        description: entereddescription,
        duedate: enteredduedate,
      },
    ]);

    // save karya pachi form clear karva mate 
    title.current.value = "";
    Description.current.value = "";
    duedate.current.value = "";

    setshowform(false);     //save button par click karya pachi form hide karva 
    seterror(false);
  }

  return (
    <div     //main container akha layout saru 
      style={{
        display: "flex",
        gap: "30px",
        padding: "10px",
      }}
    >

      <div     //sidebar css 
        style={{
          width: "300px",
          minHeight: "770px",
          backgroundColor: "#4F3B26",
          borderRadius: "8px",
          padding: "20px",
          color: "#fff",
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>Your Projects</h2>



        {projects.length > 0 ? (           //data ni length check karse jo data ni length 0 hase to data execute ni thase execute ni thase aetle map ni chlase data display ni thase ane no project yet batavse 
          projects.map((project) => ( 
                 //badha project par loop chalave ane data ne sidebar ma display karave 
            <div
            key={project.id} //badha data ne unique key aape aetle kai bi add thai change thai ke delete thai to aene khabar pade ke kai thiyu 
              style={{
                marginBottom: "15px",
                padding: "8px",
                background: "#7b4f2d",
                borderRadius: "4px",
                whiteSpace: "pre-line",
              }}
            >
              <h4 style={{ margin: 0 }}>
                title: {project.title}
              </h4>
              <p style={{ margin: "2px 0" }}>
                description: {project.description}
              </p>
              <small>Due:
                {project.duedate}
              </small>
              <br />
              <button
                onClick={() => handleDelete(project.id)}
                style={deletestle}
              >
                delete
              </button>
            </div>
          ))
        ) : (
          <p>No projects yet</p>   //jo koi data ni hase to aa text show karse 
        )}

        <button className="hover-btn" onClick={() => setshowform(true)}>
          + Add Project
        </button>
      </div>


      <div   //image , form , button css 
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "15px",
          marginTop: "40px",
        }}
      >
        <img
          src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
          alt="create project"
          style={{ width: "40px", height: "40px" }}
        />

        <button className="hover-btn" onClick={() => setshowform(true)}>
          Create New Project
        </button>

        {error && (     //koi error hase to invalid input batavse 
          <div
            style={{
              border: "2px solid red",
              padding: "10px",
              borderRadius: "6px",
              backgroundColor: "#ffe5e5",
              color: "red",
              fontWeight: "bold",
            }}
          >
            Invalid Input - Please fill all fields!
          </div>
        )}


        {showform && (
          <div
            style={{      //form container css 
              width: "420px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "20px",
              backgroundColor: "#BB9672",
            }}
          >
            <div
              style={{           // save and cancel button css
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
                marginBottom: "15px",
              }}
            >
              <button
                className="hover-btn"
                onClick={() => setshowform(false)}>
                Cancel
              </button>


              <button
                className="hover-btn"
                onClick={handlesave}>
                Save
              </button>
            </div>

            <input
              placeholder="Title"
              style={inputStyle}
              ref={title} />

            <textarea
              placeholder="Description"
              style={inputStyle}
              ref={Description}
            />

            <input
              type="date"
              style={inputStyle}
              ref={duedate} />
          </div>
        )}
      </div>


      <style>
        {`
          .hover-btn {      
            padding: 10px 14px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            background: linear-gradient(135deg, #0f766e, #2dd4bf);  //be color sathe style kari sakiye button par 
            color: white;
          }

          .hover-btn:hover {
            background: linear-gradient(135deg, rgb(227, 224, 16), rgb(17, 225, 236));  //button par cursor ley jata color change karva mate 
          }
        `}
      </style>


    </div>
  );
}

const deletestle = {
  background: "#84A4C4",
  border: "none",
  color: "black",
  borderRadius: "4px",
  padding: "8px",
  cursor: "pointer",
  marginTop: "5px",
};

const inputStyle = {    //input ne textarea css 
  width: "98%",
  padding: "10px",
  marginBottom: "12px",
  border: "1px solid #ccc",
  borderRadius: "4px",
};
