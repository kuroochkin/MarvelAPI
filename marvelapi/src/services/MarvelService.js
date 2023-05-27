import { useHttp } from "../hooks/http.hook";

const useMarvelService = () => {

    const {loading, request, error, clearError} = useHttp();

    const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    const _apikey = 'apikey=cbf7c9aba8d7bfd6b1181015da3a937e';

    const _baseOffset = 210;

    
    const getAllCharacters = async (offset = _baseOffset) => {
       const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apikey}`); 
       return res.data.results.map(_transformCharacter);
    }

    const getCharacter = async (id) => {
        const res = await request(`${_apiBase}characters/${id}?${_apikey}`); 
        return _transformCharacter(res.data.results[0]);
    }

    const getAllComics = async () => {
        const res = await request(`${_apiBase}comics?limit=8&offset=100&${_apikey}`);
        return res.data.results.map(_transformComics);
    }

    const getComic = async (id) => {
		const res = await request(`${_apiBase}comics/${id}?${_apikey}`);
		return _transformComics(res.data.results[0]);
	};

    const _transformCharacter = (char) => {
        return {
            id: char.id,
            name: char.name,
            description: char.description ? `${char.description.slice(0, 210)}...` : 'Данных о персонаже нет',
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items
        }
    }

    const _transformComics = (comics) => {
        return {
            id: comics.id,
            title: comics.title,
            description: comics.description ? `${comics.description.slice(0, 210)}...` : 'Данных о комиксе нет',
            pageCount: comics.pageCount ? `${comics.pageCount}` : 'Данных о количестве страниц нет',
            thumbnail: comics.thumbnail.path + '.' + comics.thumbnail.extension,
            language: comics.textObjects[0]?.language || "en-us",
            price: comics.prices[0].price ? `${comics.prices[0].price}$` : 'Данных о цене нет'
        }
    }

    return {loading, error, getAllCharacters, getCharacter, clearError, getAllComics , getComic};
};

export default useMarvelService;