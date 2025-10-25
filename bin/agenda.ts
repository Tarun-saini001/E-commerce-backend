import Agenda from "agenda";
const uri = process.env.MONGO_URI + "/" + process.env.MONGO_DB_NAME;

const agenda = new Agenda({
    db: { address: uri, collection: "jobs" },
    processEvery: '30 seconds'
});

export default agenda;
