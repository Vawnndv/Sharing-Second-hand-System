import haversine  from 'haversine'
export class Address {
    
    public id: any;
    public address: any;
    public longitude: any;
    public latitude: any;
    
    public constructor(id:string, address: string, longitude: any, latitude: any){
        this.id = id
        this.address = address;
        this.longitude = parseFloat(longitude);
        this.latitude = parseFloat(latitude);
    }

    public getDistance (address: Address): number{
        const location1 = {
            latitude: this.latitude,
            longitude: this.longitude
        }
        const location2 = {
            latitude: address.latitude,
            longitude: address.longitude
        }

        return haversine(location1, location2, { unit: 'meter' });
    }
}