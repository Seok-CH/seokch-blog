---
title: Compound Component Pattern에 대해 알아보기
date: '2022-10-01T22:12:03.284Z'
tags: ['react', 'design-pattern']
---

리액트 프로젝트에서 큰 단위의 복합적인 UI Components(Modal, Dialog)들을 개발하다보면 이 컴포넌트들을 상황에 따라 재사용하기 위해 세부적인 내용은 **props**를 통해서 넘겨주는 경우가 많다.

예를 들면 다음과 같은 title과 description만으로 구성된 Dialog가 있다. 이 Dialog도 다양한 곳에서 재사용되기 위해 title과 description과 같은 변할 수 있는 값은 props로 받고 있다.

```tsx
<Dialog title={title} description={description} />
```

_그런데 이 상황에서 체크박스 기능이 포함된 Dialog를 개발해야 한다면 어떻해 해야할까?_

대부분 체크박스가 포함된 새로운 Dialog를 만들고 싶지 않기 때문에 체크박스와 관련된 props를 새로 생성할 것이다. 그리고 Dialog컴포넌트 내부에서는 다른 UI를 보여주기 위해 props에 대한 조건문을 작성할 것이다.

```tsx
<Dialog
  title={'title'}
  description={'description'}
  checkBox={[
    { id: 'label1', label: 'label1', defaultChecked: true },
    { id: 'label2', label: 'label2', defaultChecked: false },
  ]}
/>;

function Dialog({ title, description, checkBox }) {
  return (
    <div>
      <h1>{title}</h1>
      <p>{description}</p>
      {checkBox &&
        checkBox.map((item) => (
          <div key={item.id}>
            <input type='checkbox' id={item.id} checked={defaultChecked} />
            <label for={item.id}>{item.label}</label>
          </div>
        ))}
    </div>
  );
}
```

그런데 만약 또 다른 기능이 계속 추가해야 한다면? 계속해서 **조건문**을 작성하는 것으로 문제를 해결할 수 있을까?

### Props전달이 가지는 한계

옵션이 많지 않은 컴포넌트라면 props전달만으로도 충분히 재사용 가능한 컴포넌트로 만들 수 있다. 하지만 요구하는 옵션들이 많을 수록 다음과 같은 문제점이 생긴다.

- 옵션들이 많을수록 코드가 복잡해지고 유지보수성이 떨어진다.
- 어떤 형태로 UI가 표현되는지 props전달만으로 예측하기 힘들다
- 세부적인 커스터마이징하기가 어렵다

결국 props전달이 가지는 한계는 복합 컴포넌트 아래에 있는 세부기능을 담당하는 **서브 컴포넌트**들이 어떤 것이 있는지 그리고 어떻게 위치하는지에 대해 **선언적으로** 작성할 수 없다는 것이다.

이런 문제점을 해결하기 위해서는 복합 컴포넌트에서 **서브 컴포넌트를 제어할 수 있는 API**를 제공해야하는데 다행히도 이런 문제를 해결한 `Compound Component Pattern`이라는 디자인 패턴이 존재한다.

### Compound Component Pattern이란?

**Compound Component Pattern**이란 하나의 복합 컴포넌트들을 특정 기능을 가지는 서브 컴포넌트들로 분리하고 사용하는 쪽에서 원하는 형태로 서브 컴포넌트들을 조립하여 컴포넌트를 구성하는 방식이다.

간단한 예시를 들면 아래의 `<Menu />`라는 복합 컴포넌트는 `Button`, `List`, `Item`이라는 서브 컴포넌트들을 원하는 형태로 조립할 수 있도록 API를 제공한다. 코드만 봐도 어떤 기능들이 있고 어떻게 UI가 표현될지 한 눈에 보인다.

```tsx
import Menu from 'components/ui/Menu';

function CustomMenu() {
  return (
    <Menu>
      <Menu.Button>Choose One</Menu.Button>
      <Menu.List>
        <Menu.Item>Menu1</Menu.Item>
        <Menu.Item>Menu2</Menu.Item>
        <Menu.Item>Menu3</Menu.Item>
      </Menu.List>
    </Menu>
  );
}
```

그리고 중요한 Compound Component Pattern의 특징은 **상세한 기능 동작에 대한 구현이 숨겨져 있는 것이다**. 보통 `<Menu />`같은 제일 최상위 컴포넌트는 상태에 대한 정보를 가지고 있고 **Context API**를 통해 상태를 서브 컴포넌트에게 전달한다.

```tsx
import React from 'react';

const MenuContext = React.createContext<{
  on: boolean;
  toggle: () => void;
} | null>(null);

function Menu(props: React.PropsWithChildren) {
  const [on, setOn] = React.useState(false);
  const toggle = () => setOn((oldOn) => !oldOn);

  return (
    <MenuContext.Provider value={{ on, toggle }}>
      {props.children}
    </MenuContext.Provider>
  );
}

function useMenuContext() {
  const context = React.useContext(MenuContext);
  if (!context) {
    throw new Error(`cannot be rendered outside the Menu component`);
  }
  return context;
}
```

서브 컴포넌트들은 Context API로 전달받은 정보로 로직을 작성하고 최종적으로는 최상위 `Menu`객체의 프로퍼티로 등록하여 Menu를 import하면 서브 컴포넌트도 사용할 수 있게끔 한다

```tsx
function Button(props: React.PropsWithChildren) {
  const { toggle } = useMenuContext();
  return <button onClick={toggle}>{props.children}</button>;
}

function List(props: React.PropsWithChildren) {
  const { on } = useMenuContext();
  return on && <ul>{props.children}</ul>;
}

function Item(props: React.PropsWithChildren) {
  return <li>{props.children}</li>;
}

Menu.Button = Button;
Menu.List = List;
Menu.Item = Item;

export default Menu;
```

### 이 패턴을 고려해보면 좋을 때

Compound Component Pattern도 특정 상황에 적합한 해결책이지 모든 상황에서 적용할 수 없다.
그러므로 이 패턴이 가지는 장단점을 알고 적용을 해야한다.

#### 👍 장점

- 여러 개의 컴포넌트를 하나의 단위로 그룹화하여 코드베이스를 단순화하므로 코드를 유지 보수하고 업데이트하기 쉬워진다
- 서브 컴포넌트로 구분하는 과정에서 서브 컴포넌트의 역할에 대해 명확히 알 수 있다.
- 사용하는 쪽에서 자유롭게 커스터마이징을 할 수 있다
- 상세 기능 구현은 숨겨져 있고 어떤 기능만 들어올지를 작성하기 때문에 선언적으로 사용할 수 있다

#### 👎 단점

- 여러 컴포넌트를 개별적으로 사용하는 것보다 Compound component를 만드는 데 더 많은 초기 작업이 필요할 수 있다.
- 모든 컴포넌트에 대하여 compound component의 동작을 사용자 지정하는 것이 어려울 수 있다. 일부 컴포넌트들은 기능을 명확히 구분 짓기가 힘들다.

#### 😀 결론

그래서 정리해보자면 이 패턴을 고려해볼 컴포넌트는 다음 기준을 충족해야한다고 생각한다.

1. **초기 작업이 필요하므로 적은 기능을 가진 컴포넌트 보다는 기능이 많은 컴포넌트**
2. **기능을 명확히 구분 지을 수 있는 컴포넌트**

### 참고한 자료

- https://www.patterns.dev/posts/compound-pattern
- https://kentcdodds.com/blog/compound-components-with-react-hooks
- https://fe-developers.kakaoent.com/2022/220731-composition-component/
