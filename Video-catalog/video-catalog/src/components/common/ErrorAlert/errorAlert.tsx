import  { Alert } from "react-bootstrap";


interface props{
    error?:Error;
};

export const ErrorAlert = ({error=new Error('something went wrong'), variant="danger"}:props & {variant?: string}) => {
    return (
        <Alert variant={variant}>
            {error.message}
        </Alert>
     );
}