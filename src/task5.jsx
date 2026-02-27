import React, { useEffect, useState } from 'react';

export default  function Posts() {
  const [posts, setPosts] = useState([]);     //api thi aavela data store kare 
  const [loading, setLoading] = useState(false);  //check kare ke data load thatha che ke nathi 
  const [error, setError] = useState(null);         //error message store thai 
  const [search, setsearch] = useState("");     //current value store kare  and search ni value change kare 

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true); // start loading
      try {
        const response = await fetch("https://jsonplaceholder.typicode.com/posts");  //data aave 
        if (!response.ok) {             //api call fail thai aetle  error throw karse 
          throw new Error("Network response was not ok");
        }
        const data = await response.json();         //response ne json ma convert kare 
        setPosts(data);         //posts state ma data store kare 
      } catch (err) {                   
        setError(err.message);          //koi error aave to state ma store kare 
      } finally {
        setLoading(false); // api call success thai ke fail loading stop they jai 
      }
    };

    fetchPosts(); // call the function
  }, []);   //jyare component load thai tyre j 1 var run thai 

  if (loading) return <h2 style={{fontSize:"30px",textAlign:"center"}}>Loading posts....</h2>;  //data load thatha hoi tyare aa text dekhade
  if (error) return <h2>Error: {error}</h2>;  //jo koi error aave to aa text dekhase 
  

                                                  // filter badha posts ne check kare 
const filteredPosts = posts.filter((posts) => {
  if (!search.trim()) return true; // jo search empty hase to badha data show karse 

  const searchWords = search.toLowerCase().split(" "); // small/capital no issue ni rey ne badha word alag they jai

  const content = `${posts.id} ${posts.title} ${posts.body}`.toLowerCase(); //badha field ne jodi dey ne ek j jagye search thase 
                    //$ ka use three value ne ek j string ma jodi rakhvanu kam kare 

  return searchWords.every(word => content.includes(word)); //badha words ne check kare and ek word bi miss thai to false and badha word match they jai to true 
});
  



  const liststyle= { liststyle: "none", padding: 0 };   //posts na bullet point ne remove kari dey 
  const getpoststyle= () => ({          //badha posts ne same style return kare 
    margin:"10px",
    border:"3px solid black",
    borderRadius:"15px",
    padding:"15px",  
    fontSize:"25px",
  })

  return (
    <div>
      <input
      style={{ width:"97%",margin:"10px", borderRadius:" 8px ", border:"1px solid #ccc", padding:"10px", fontSize:"20px",fontWeight:"bold"}}
      type='text'
      placeholder='search'
      value={search}
      onChange={(e)=> setsearch(e.target.value)} 
      />

      <ul style={liststyle}>
        {filteredPosts.map((posts) => (                  //badha posts ne list ma convert kare and data ne display karave 
        //data ne read kare and dispay karave 
          <li key={posts.id} style={getpoststyle()}>
            <strong>{posts.id}<br />  </strong>
            <strong> title:{posts.title}<br /></strong>
            <strong>body:{posts.body}<br /></strong>
          </li>
        ))}
      </ul>
    </div>
  );
}


