import * as React from 'react';
import { IArgument, IParameter } from './store/interface/invoke.interface';
import { IIntl } from '@/store/interface/intl.interface';
import { Parameters } from './Parameters';

interface IProps {
    title: string;
    arguments: IParameter[];
    onChange: (args: IArgument[]) => void;
    intl: IIntl
}

interface IState {
    arguments: IArgument[];
}

export class ParametersTree extends React.Component<IProps, IState>{

    public state: IState = {
        arguments: []
    }

    public render() {
        return (
            <>
                {
                    this.props.arguments.map((item, index) => {
                        return (
                            <Parameters intl={ this.props.intl } key={ index } title={ item.name } index={ index } arguments={ item } onChange={ this.onSelectChange } />
                        )
                    })
                }
            </>
        )
    }

    private onSelectChange = (title: string, index: number, event: IArgument) => {
        const args = this.state.arguments;
        args[ index ] = event;
        if (event.type === "none") {
            args.splice(index, 1);
        }
        console.log("arguments tree", args);

        this.setState({ arguments: args }, () => {
            this.props.onChange(args)
        })
    }

}