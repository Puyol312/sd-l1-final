import * as jsonfile from "jsonfile";
// El siguiente import no se usa pero es necesario
import "./pelis.json";
import { rejects } from "assert";
// de esta forma Typescript se entera que tiene que incluir
// el .json y pasarlo a la carpeta /dist
// si no, solo usandolo desde la libreria jsonfile, no se dá cuenta

// no modificar estas propiedades, agregar todas las que quieras
class Peli {
  id: number;
  title: string;
  tags: string[];
}
type SearchOptions = { title?: string; tag?: string };

class PelisCollection{
  private filepash:string; 
  constructor(ubicacion:string){
    this.filepash = ubicacion;
  }
  getAll(): Promise<Peli[]> {
    return jsonfile.readFile(this.filepash).then((pelis) => {
      return pelis;
    }).catch(() => null);
  }
  add(peli:Peli):Promise<boolean>{
    return this.getAll()
      .then((data) => {
        const existe = data.find((posible) => {return posible.id === peli.id})
        if(existe){
          return false;
        }
        else{
          data.push(peli);
          return jsonfile.writeFile(this.filepash,data).then(() => {return true}).catch(()=>{return false})
        }
      })
      .catch(()=>{return false})
  }
  getById(id:number):Promise<Peli>{
    return this.getAll()
    .then((data)=>{
      return data.find((posible) => posible.id === id) || null;
    })
    .catch(() => null)
  }
  async search(options:SearchOptions):Promise<Peli[]>{
    const pelis = await this.getAll();

    const byTitle = options.title
      ? await pelis.filter((p) => p.title.includes(options.title))
      : [];

    const byTag = options.tag
      ? pelis.filter((p) => p.tags.includes(options.tag))
      : [];

    const map = new Map<number, Peli>();
    for (const peli of [...byTitle, ...byTag]) {
      map.set(peli.id, peli);
    }
    return Array.from(map.values());
  }
}
export { PelisCollection, Peli };
