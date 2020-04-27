import React, {useEffect, useState} from 'react';
import HashtagsAPI from "../services/hashtagsAPI";

const InputSearch = ({theSearchResults, theCurrentPage}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [closed, setClosed] = useState(true);

    useEffect(() => {
        searchTerm && search(searchTerm)
    }, [searchTerm])

    const handleSearchInputChanges = ({currentTarget}) => {
        setSearchTerm(currentTarget.value)
        theCurrentPage(1)
        setClosed(false)
    };
    //
    // const resetInputField = () => {
    //     setSearchTerm('')
    //     setSearchResults([])
    //     setClosed(true)
    // }

    const callSearchFunction = (e) => {
        if(e.key === 'Enter'){
            const value = e.currentTarget.value;
            setSearchTerm(value)
            setSearchTerm("")
            setClosed(true)
        }
    }

    const search = async () => {
        if (searchTerm.length > 1) {
            try {
                const search = await HashtagsAPI.findAll()
                const results = search.filter(tag =>
                    tag.name.toLowerCase().includes(searchTerm.toLowerCase().trim(), 0)
                );
                setSearchResults(results);
                theSearchResults(results);
            } catch (e) {
                console.log(e.response)
            }
        } else {
            setSearchResults([])
        }
    };

    function persistAndClosed(value) {
        setSearchTerm("")
        theSearchResults([value]);
        setClosed(true)
    }

    return(
        <div className="autocomplete">
            <input type="text" onKeyPress={callSearchFunction} onChange={handleSearchInputChanges}
                   value={searchTerm} className="form-control" placeholder="Rechercher un #hashtag"
            />
            <div className={"autocomplete-items " + (closed && "d-none")}>
                {(searchTerm.length > 1) &&
                searchResults.map((item) => <div key={item.id} onClick={persistAndClosed.bind(this, item)}>{item.name} ({item.posts.length})</div>)
                }
            </div>

        </div>
    );
};

export default InputSearch;