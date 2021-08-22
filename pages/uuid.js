import { v4 as uuid } from 'uuid'

export default function  UUID() {
    // console.log(uuid())
    // const uuid = uuidv1();
    // uuid =uuid.replace(/[^0-9a-z]/gi, '');
    return (
        <div>
            { uuid().replace(/[^0-9a-z]/gi, '') }
        </div>
    )
}
