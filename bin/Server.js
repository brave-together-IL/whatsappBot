
const axios = require('axios');

class Server {
    constructor() {
        this.token = '';
        this.auth = {
            username: 'alon@gmail.com',
            password: 'azor'
        };
    }

    /**
     *
     * @param {string} firstName
     * @param {string} lastName
     * @param {string} city
     * @param {string} email
     * @param {string} phone
     * @return {Promise<object>}
     */
    async createUser(firstName, lastName, city, email, phone){
        const requestOptions = {
            method: 'POST',
            url: 'http://localhost:5000/user',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                "email": email,
                "password": city,
                "first_name": firstName,
                "last_name": lastName,
                "cellphone": phone
            }
        }
        let response = await axios.request(requestOptions).catch(err=>{
            console.log(err);
        });
        if (!response || response.status !== 201){
            console.log('error\n', response);
            return ''
        }
        return response.data;
    }

    /**
     *
     * @param {string} id
     * @return {Promise<object>}
     */
    async getUserById(id){
        if(id==="0"){
            return {};
        }
        const requestOptions = {
            method: 'GET',
            url: 'http://localhost:5000/user/'+id
        }
        let response = await axios.request(requestOptions).catch(err=>{
            console.log(err);
        });
        if (!response){
            return {}
        }
        return response.data;
    }

    /**
     *
     * @return {Promise<{}|any>}
     */
    async getAllUsers(){
        const requestOptions = {
            method: 'GET',
            url: 'http://localhost:5000/user/0'
        }
        let response = await axios.request(requestOptions).catch(err=>{
            console.log(err);
        });
        if (!response){
            return {}
        }
        return response.data;
    }


    /**
     *
     * @param {string} id
     * @return {Promise<object>}
     */
    async deleteUserById(id){
        const requestOptions = {
            method: 'DELETE',
            url: 'http://localhost:5000/user/'+id
        }
        let response = await axios.request(requestOptions).catch(err=>{
            console.log(err);
        });
        if (!response){
            return {}
        }
        return response.data;
    }

    /**
     *
     * @param {string[]} tags
     * @return {Promise<*[]|any>}
     */
    async getEventsByTag(tags){
        let tagsFormatted = "";
        for(let i=0;i<tags.length;i++) {
            tagsFormatted += tags[i]+',';
        }
        tagsFormatted = tagsFormatted.substr(0, tagsFormatted.length-1);
        const requestOptions = {
            method: 'GET',
            url: 'http://localhost:5000/events',
            headers: {
                'Content-Type': 'application/json'
            },
            params: {
                'tags_any': tagsFormatted
            },
            auth: this.auth
        }
        let response = await axios.request(requestOptions).catch(err=>{
            console.log(err);
        });
        if (!response){
            return [];
        }
        return response.data;



    }


    async refreshToken(){
        const requestOptions = {
            method: 'GET',
            url: 'http://localhost:5000/token',
            auth: this.auth
        }
        const res = await axios.request(requestOptions).catch(err=>console.log(err));
        if (!res){
            return '';
        }
        this.token = res.data.token;
        return this.token;
    }

    /**
     *
     * @param {string[]} tags
     * @param {string} title
     * @param {string}description
     * @param {string}startTime
     * @param {string}endTime
     * @param {int}reward
     * @param {string} geolocation
     * @return {Promise<object>}
     */
    async createEvent(tags = [], title="", description="", startTime="", endTime="", reward=0,  geolocation=""){
        let payload = {"title":title};
        if(tags!==[]){
            payload["tags"] = tags;
        }
        if(description!==""){
            payload["description"] = description;
        }
        if(startTime!==""){
            payload["start_time"] =  startTime;
        }
        if(endTime!==""){
            payload["end_time"] = endTime;
        }
        if(reward>0){
            payload["reward"] = reward;
        }
        if(geolocation!==""){
            payload["geolocation"] = geolocation;
        }
        const requestOptions = {
            method: 'POST',
            url: 'http://localhost:5000/events',
            headers: {
                'Content-Type': 'application/json'
            },
            auth: {
                username: 'alon@gmail.com',
                password: 'azor'
            },
            data: payload
        }
        const res = await axios.request(requestOptions).catch((err)=>{
                console.log(err);
            }
        );
        return res.data;
    }

    /**
     *
     * @param {string} id
     * @param {string[]} tags
     * @param {string} title
     * @param {string}description
     * @param {string}startTime
     * @param {string}endTime
     * @param {int}reward
     * @return {Promise<object>}
     */
    async updateEvent(id, tags = [], title="", description="", startTime="", endTime="", reward=0){
        let payload = {
            "message": "updated",
            "event_data": {}
        };
        if(title!==""){
            payload.event_data['title'] = title;
        }
        if(tags!==[]){
            payload.event_data["tags"] = ""
            for(let i=0;i<tags.length;i++) {
                payload.event_data["tags"] += tags[i]+',';
            }
            payload.event_data["tags"] = payload.event_data["tags"].substr(0, payload.event_data["tags"].length-1);
        }
        if(description!==""){
            payload.event_data["description"] = description;
        }
        if(startTime!==""){
            payload.event_data["start_time"] =  startTime;
        }
        if(endTime!==""){
            payload.event_data["end_time"] = endTime;
        }
        if(reward>0){
            payload.event_data["reward"] = reward;
        }
        const requestOptions = {
            method: 'PATCH',
            url: 'http://localhost:5000/events/'+id,
            headers: {
                'Content-Type': 'application/json'
            },
            auth: {
                username: 'alon@gmail.com',
                password: 'azor'
            },
            data: payload
        }
        const res = await axios.request(requestOptions).catch((err)=>{
                console.log(err);
            }
        );
        return res.data;
    }


    async participateEvent(){

    }
}
module.exports = Server;
/*
curl http://localhost:5000/user -X POST -H Content-Type: application/json -d
 */
