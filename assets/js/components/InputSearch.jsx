import React, {useEffect, useState} from 'react';
import HashtagsAPI from "../services/hashtagsAPI";

const InputSearch = ({theSearchResults}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [closed, setClosed] = useState(true);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchTerm.length >1) searchTerm && search(searchTerm)
        }, 250)
        return () => clearTimeout(delayDebounceFn)
    }, [searchTerm])

    const handleSearchInputChanges = ({currentTarget}) => {
        setSearchTerm(currentTarget.value.split(" ").join(""))
        setClosed(false)
    };

    const handleKeyEnterPress = (event) => {
        if (event.key === 'Enter') {
            const value = event.currentTarget.value;
            setSearchTerm(searchResults[0] && searchResults[0].name || value )
            setClosed(true)
        }
    }

    const search = async () => {
        if (searchTerm.length > 1) {
            try {
                const search = await HashtagsAPI.findAll()
                const results = await search.filter(tag =>
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

    const persistAndClosed = value => {
        theSearchResults([value]);
        setSearchTerm("")
        setClosed(true)
    }

    const handleTouch = () => {
        setTimeout(() => {
            setClosed(true)
        }, 150);
    }

    return (
        <div className="autocomplete">
            <input type="text" onKeyPress={handleKeyEnterPress} onChange={handleSearchInputChanges}
                   onBlur={handleTouch}
                   autoComplete="off"
                   value={searchTerm} className="form-control" placeholder="Rechercher un #hashtag"
            />
            <div className={"autocomplete-items " + (closed && "d-none")}>
                {(searchTerm.length > 1) &&
                searchResults.map((item) =>
                    (item.posts.length > 0) &&
                    (<div key={item.id} onClick={persistAndClosed.bind(this, item)}>{item.name} ({item.posts.length})</div>)
                )
                }
            </div>
        </div>
    );
};

export default React.memo(InputSearch);
