import React, {createRef} from 'react';
import {Button,IconButton,Link,TextInput} from '../src/index.js';
<Button ref={createRef<HTMLButtonElement>()} onClick={e=>e.currentTarget.focus()}>Save</Button>;
<IconButton aria-label="Add" icon={<svg/>}/>;
<Link href="/" ref={createRef<HTMLAnchorElement>()}>Home</Link>;
<TextInput label="Name" name="name" value="Ada" onChange={e=>e.currentTarget.value}/>;
<TextInput label="Name" name="name" value="Ada" readOnly/>;
// @ts-expect-error accessible name required
<IconButton icon={<svg/>}/>;
// @ts-expect-error text variant absent from IconButton
<IconButton aria-label="Add" icon={<svg/>} variant="text"/>;
// @ts-expect-error conflicting value ownership
<TextInput label="Name" name="name" value="Ada" defaultValue="B" onChange={()=>{}}/>;
// @ts-expect-error controlled editable input requires callback
<TextInput label="Name" name="name" value="Ada"/>;
// @ts-expect-error submit input is outside this component contract
<TextInput label="Submit" name="submit" type="submit"/>;

<TextInput label="Code" name="code" width="4ch"/>;
// @ts-expect-error source prohibits placeholder text
<TextInput label="Name" name="name" placeholder="Your name"/>;
// @ts-expect-error visible label must own the accessible name
<TextInput label="Name" name="name" aria-label="Different name"/>;
// @ts-expect-error width must be a canonical width
<TextInput label="Name" name="name" width="50%"/>;
